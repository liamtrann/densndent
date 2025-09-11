const stripeService = require("./stripe.service");
const restApiService = require("../restapi/restapi.service");
const transactionService = require("../suiteQL/transaction/transaction.service");
const crypto = require("crypto");

// In-memory cache for recent Stripe orders (use Redis in production)
const recentStripeOrders = new Map();
const STRIPE_WINDOW_MINUTES = Number(
  process.env.IDEMPOTENCY_WINDOW_MINUTES || 10
);

function toCents(amount) {
  // Handle null/undefined/invalid values
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 0;
  }

  // Convert to number and round to avoid floating point issues
  const dollars = Number(amount);
  const cents = Math.round(dollars * 100);

  // Ensure it's a positive integer
  return Math.max(0, cents);
}

function stableCartString(items = []) {
  return items
    .map((i) => `${i.item?.id || i.id}x${i.quantity || 1}`)
    .sort()
    .join("|");
}

function makeStripeIdempotencyKey(orderData = {}) {
  const customerId = orderData.orderPayload?.entity?.id || "anon";
  const shipMethodId = orderData.orderPayload?.shipMethod?.id || "na";
  const cartItems = Array.isArray(orderData.orderPayload?.item?.items)
    ? orderData.orderPayload.item.items
    : [];
  const cartStr = stableCartString(cartItems);

  // Use shipping address for uniqueness (optional - only if provided)
  const shipAddr = orderData.orderPayload?.shipAddress;
  const addressStr = shipAddr
    ? `${shipAddr.line1 || ""}|${shipAddr.city || ""}|${shipAddr.state || ""}|${shipAddr.zip || ""}`
    : "na";

  // DON'T include paymentIntentId - same cart should have same key regardless of payment intent
  // Use a stable time window (10 minute buckets)
  const windowBucket = Math.floor(
    Date.now() / (STRIPE_WINDOW_MINUTES * 60 * 1000)
  );

  const raw = `${customerId}|${shipMethodId}|${cartStr}|${addressStr}|${windowBucket}`;
  const hash = crypto
    .createHash("sha256")
    .update(raw)
    .digest("hex")
    .slice(0, 16);
  return hash;
}

// Order creation logic with duplicate prevention (similar to createSalesOrder)
async function createStripeOrder(orderData) {
  console.log(`💳 [STRIPE] Creating sales order for Stripe payment...`);

  if (!orderData.orderPayload?.entity?.id) {
    throw new Error(
      `Invalid customer ID: ${orderData.orderPayload?.entity?.id}`
    );
  }

  // Check for items in the NetSuite format (orderData.orderPayload.item.items)
  if (
    !orderData.orderPayload?.item?.items ||
    orderData.orderPayload.item.items.length === 0
  ) {
    console.error(
      "❌ [STRIPE] Order data structure:",
      JSON.stringify(orderData, null, 2)
    );
    throw new Error("No items provided for order");
  }

  console.log(
    `📦 [STRIPE] Processing ${orderData.orderPayload.item.items.length} items for customer ${orderData.orderPayload.entity.id}`
  );
  console.log(
    `📧 [STRIPE] Order will be emailed to: ${orderData.orderPayload.email}`
  );

  // Generate idempotency key for duplicate prevention
  const idemKey = makeStripeIdempotencyKey(orderData);
  const externalId = `stripe-checkout-${idemKey}`;

  console.log(`🔑 [STRIPE] Debug - Raw order data for key generation:`, {
    customerId: orderData.orderPayload?.entity?.id,
    shipMethodId: orderData.orderPayload?.shipMethod?.id,
    itemCount: orderData.orderPayload?.item?.items?.length,
    cartItems: orderData.orderPayload?.item?.items?.map(
      (i) => `${i.item?.id || i.id}x${i.quantity || 1}`
    ),
    paymentIntentId: orderData.stripePaymentIntentId,
  });
  console.log(`🔑 [STRIPE] Using idempotency key: ${idemKey}`);
  console.log(`🆔 [STRIPE] Using external ID: ${externalId}`);

  // Fast-path: return cached order if already created in the window
  const cached = recentStripeOrders.get(idemKey);
  if (cached) {
    console.log(
      `⚠️ [STRIPE] DUPLICATE ORDER DETECTED from cache for payment: ${orderData.stripePaymentIntentId}`
    );
    console.log(`⚠️ [STRIPE] Cache hit details:`, {
      cachedOrderId: cached.id,
      currentPaymentIntent: orderData.stripePaymentIntentId,
      idempotencyKey: idemKey,
    });
    return {
      ...cached,
      externalId: externalId, // Include externalId in response
      isDuplicate: true,
      message:
        "Order already placed! To place the same order again, please wait 10 minutes.",
    };
  }

  console.log(
    `✅ [STRIPE] No cached order found, proceeding with new order creation`
  );
  console.log(
    `📋 [STRIPE] Current cache size: ${recentStripeOrders.size} orders`
  );
  console.log(
    `📋 [STRIPE] Cached keys:`,
    Array.from(recentStripeOrders.keys())
  );

  // Use provided memo or create default memo with Stripe payment information
  const today = new Date().toISOString().slice(0, 10);
  const memo =
    orderData.orderPayload.memo ||
    (orderData.stripePaymentIntentId
      ? `STRIPE Payment - Payment ID: ${orderData.stripePaymentIntentId} - Created: ${today}`
      : `STRIPE Payment - Created: ${today}`);

  // Add memo and external ID to order data
  const finalOrderData = {
    ...orderData.orderPayload,
    memo: memo,
    stripePaymentIntentId: orderData.stripePaymentIntentId,
    externalId: externalId,
  };

  console.log(`📝 [STRIPE] Using memo: ${memo}`);

  try {
    console.log(`🚀 [STRIPE] Sending order to NetSuite...`);

    const salesOrder = await restApiService.postRecord(
      "salesOrder",
      finalOrderData
    );

    console.log(
      `💰 [STRIPE] Created sales order for payment: ${orderData.stripePaymentIntentId}`
    );

    // Cache for the configured window
    console.log(
      `💾 [STRIPE] Caching order with key: ${idemKey} for ${STRIPE_WINDOW_MINUTES} minutes`
    );
    recentStripeOrders.set(idemKey, salesOrder);
    setTimeout(
      () => {
        console.log(`🗑️ [STRIPE] Removing cached order with key: ${idemKey}`);
        recentStripeOrders.delete(idemKey);
      },
      STRIPE_WINDOW_MINUTES * 60 * 1000
    );

    // Create recurring orders if any exist
    if (
      orderData.recurringOrderPayload &&
      orderData.recurringOrderPayload.length > 0
    ) {
      console.log(
        `🔄 [STRIPE] Creating ${orderData.recurringOrderPayload.length} recurring orders...`
      );

      for (const recurringOrder of orderData.recurringOrderPayload) {
        try {
          const recurringOrderResult = await restApiService.postRecord(
            "customrecord_recurring_order",
            recurringOrder
          );
          console.log(
            `✅ [STRIPE] Created recurring order ID: ${recurringOrderResult.id}`
          );
        } catch (recurringError) {
          console.error(
            `❌ [STRIPE] Failed to create recurring order:`,
            recurringError.message
          );
          // Don't throw error for recurring order failures, just log them
        }
      }
    }

    console.log(`✅ [STRIPE] Sales order creation completed successfully`);

    return {
      ...salesOrder,
      externalId: externalId // Include externalId in response
    };
  } catch (error) {
    // Handle duplicate external ID from NetSuite by fetching existing order
    const msg = error?.response?.data?.message || error?.message || "";
    if (
      msg.toLowerCase().includes("duplicate") ||
      msg.toUpperCase().includes("DUPLICATE")
    ) {
      console.log(
        `🔍 [STRIPE] Duplicate external ID detected, searching for existing order...`
      );
      try {
        const found = await restApiService.searchRecords("salesOrder", {
          externalId,
        });
        if (Array.isArray(found) && found.length > 0) {
          console.log(
            `✅ [STRIPE] Found existing order for duplicate external ID: ${found[0].id}`
          );

          // Cache the found order
          console.log(
            `💾 [STRIPE] Caching found duplicate order with key: ${idemKey}`
          );
          recentStripeOrders.set(idemKey, found[0]);
          setTimeout(
            () => {
              console.log(
                `🗑️ [STRIPE] Removing cached duplicate order with key: ${idemKey}`
              );
              recentStripeOrders.delete(idemKey);
            },
            STRIPE_WINDOW_MINUTES * 60 * 1000
          );

          return {
            ...found[0],
            externalId: externalId, // Include externalId in response
            isDuplicate: true,
            message:
              "Order already placed! To place the same order again, please wait 10 minutes.",
          };
        }
      } catch (searchError) {
        console.error(
          `❌ [STRIPE] Failed to search for existing order:`,
          searchError.message
        );
        // fall through to original error
      }
    }

    console.error(`❌ [STRIPE] Sales order creation failed:`, {
      error: error.message,
      customerId: orderData.orderPayload?.entity?.id,
      itemCount: orderData.orderPayload?.item?.items?.length || 0,
      paymentIntentId: orderData.stripePaymentIntentId,
      email: orderData.orderPayload?.email,
      memo: memo,
      externalId: externalId,
      idempotencyKey: idemKey,
    });

    throw new Error(`Sales order creation failed: ${error.message}`);
  }
}

class StripeController {
  async createStripeCustomer(req, res) {
    const { email, name, phone } = req.body;

    // Basic validation
    if (!email || !name) {
      return res.status(400).json({
        message: "Email and name are required",
      });
    }

    /*  Create Stripe customer and store stripe's customer id against the existing customer   */
    try {
      const customer = await stripeService.createStripeCustomer({
        email,
        name,
        phone,
      });

      console.log("Stripe customer created:", customer);

      res.status(200).json({
        message: "Stripe customer created successfully",
        customerId: customer.id,
        customerEmail: customer.email,
      });
    } catch (err) {
      console.error("Error creating Stripe customer:", err);
      res.status(400).json({
        message: "An error occurred while creating Stripe customer",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
  async getCustomer(req, res) {
    try {
      const { customerId } = req.params;

      if (!customerId) {
        return res.status(400).json({ message: "Customer ID is required" });
      }

      const customer = await stripeService.retrieveCustomer(customerId);

      res.status(200).json({
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          created: customer.created,
        },
      });
    } catch (err) {
      console.error("Error retrieving customer:", err);
      res.status(400).json({
        message: "An error occurred while retrieving customer",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }

  async updateCustomer(req, res) {
    try {
      const { customerId } = req.params;
      const updateData = req.body;

      if (!customerId) {
        return res.status(400).json({ message: "Customer ID is required" });
      }

      const customer = await stripeService.updateCustomer(
        customerId,
        updateData
      );

      res.status(200).json({
        message: "Customer updated successfully",
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
      });
    } catch (err) {
      console.error("Error updating customer:", err);
      res.status(400).json({
        message: "An error occurred while updating customer",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
  async getCustomerByEmail(req, res) {
    const { email } = req.params;

    // Basic validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    try {
      const customer = await stripeService.getCustomerByEmail(email);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found with this email",
        });
      }

      res.status(200).json({
        success: true,
        customer: customer,
      });
    } catch (err) {
      console.error("Error fetching customer by email:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }

  async attachPaymentMethod(req, res) {
    const { paymentMethod } = req.body;
    const { customerId } = req.params;

    /* Before Edit */
    /*
    const { cardNumber, expMonth, expYear, name, address } = req.body;
    const card = {
      number: cardNumber,
      exp_month: parseInt(expMonth),
      exp_year: parseInt(expYear),
    };
    const billingDetails = {
      name: name,
      address: {
        country: address.country,
        state: address.state,
        city: address.city,
        line1: address.line,
        postal_code: address.postalCode,
      },
    };
    */

    // Basic validation
    if (!paymentMethod || !paymentMethod.id) {
      return res.status(400).json({
        message: "Payment method ID is required",
      });
    }

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID is required",
      });
    }

    /* Fetch the Customer Id of current logged in user from the database */
    // const customerId = "cus_Lh8BpVkOo5akHN";

    try {
      const method = await stripeService.attachPaymentMethod(
        paymentMethod.id,
        customerId
      );
      res.status(200).json({
        message: "Payment method attached successfully",
        paymentMethod: {
          id: method.id,
          type: method.type,
          card: method.card,
          billing_details: method.billing_details,
        },
      });
    } catch (err) {
      console.error("Error attaching payment method:", err);
      res.status(400).json({
        message: err.message,
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }

  async listPaymentMethods(req, res) {
    try {
      const { customerId } = req.params;
      const { type } = req.query;

      if (!customerId) {
        return res.status(400).json({ message: "Customer ID is required" });
      }

      const paymentMethods = await stripeService.listPaymentMethods(
        customerId,
        type
      );

      res.status(200).json({
        paymentMethods: paymentMethods.data.map((pm) => ({
          id: pm.id,
          type: pm.type,
          card: pm.card,
          billing_details: pm.billing_details,
          created: pm.created,
        })),
      });
    } catch (err) {
      console.error("Error listing payment methods:", err);
      res.status(400).json({
        message: "An error occurred while listing payment methods",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }

  async detachPaymentMethod(req, res) {
    try {
      const { paymentMethodId } = req.params;

      if (!paymentMethodId) {
        return res.status(400).json({
          message: "Payment method ID is required",
        });
      }

      const detachedPaymentMethod =
        await stripeService.detachPaymentMethod(paymentMethodId);

      res.status(200).json({
        message: "Payment method detached successfully",
        paymentMethod: detachedPaymentMethod,
      });
    } catch (err) {
      console.error("Error detaching payment method:", err);
      res.status(400).json({
        message: "An error occurred while detaching payment method",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }

  async createPayment(req, res) {
    const {
      paymentMethod,
      amount,
      currency = "cad",
      customerId,
      description,
    } = req.body;

    // Basic validation
    if (!paymentMethod) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Valid amount is required",
      });
    }

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID is required",
      });
    }

    /* Query database for getting the payment amount and customer id of the current logged in user */
    // const amount = 1000;
    // const currency = "INR";
    // const userCustomerId = "cus_Lh8BpVkOo5akHN";

    try {
      const paymentIntent = await stripeService.createPaymentIntent({
        amount: toCents(amount), // Safely convert to cents
        currency: currency,
        customer: customerId,
        payment_method: paymentMethod,
        confirmation_method: "manual", // For 3D Security
        description: description || "Payment for order",
      });

      /* Add the payment intent record to your database if required */
      res.status(200).json({
        paymentIntent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          description: paymentIntent.description,
        },
      });
    } catch (err) {
      console.error("Error creating payment:", err);
      res.status(500).json({
        message: "Could not create payment",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
  async confirmPayment(req, res) {
    const { paymentMethodId, paymentIntentId, orderData } = req.body;

    if (!paymentMethodId) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    // Basic validation
    if (!paymentIntentId) {
      return res.status(400).json({
        message: "Payment intent ID is required",
      });
    }

    let salesOrder = null;
    let paymentIntent = null;

    try {
      // 1. ALWAYS CREATE ORDER FIRST (regardless of payment outcome)
      if (orderData) {
        const today = new Date().toISOString().slice(0, 10);

        try {
          // Create order with pending payment status
          const orderDataWithPayment = {
            ...orderData,
            stripePaymentIntentId: paymentIntentId,
            orderPayload: {
              ...orderData.orderPayload,
              memo: `**LOADING** - STRIPE Payment - Payment ID: ${paymentIntentId} - Created: ${today} - Status: Order created, payment pending confirmation`,
            },
          };

          salesOrder = await createStripeOrder(orderDataWithPayment);

          // Check if this is a duplicate order
          if (salesOrder.isDuplicate) {
            console.log(
              `⚠️ [STRIPE] Duplicate order detected for payment: ${paymentIntentId}`
            );

            return res.status(200).json({
              success: false,
              isDuplicate: true,
              message:
                salesOrder.message ||
                "Order already placed! To place the same order again, please wait 10 minutes.",
              salesOrder: { created: true, isDuplicate: true },
              paymentIntentId: paymentIntentId,
            });
          }

          console.log(
            `✅ [STRIPE] Order created for payment: ${paymentIntentId}`
          );
        } catch (orderError) {
          console.error(
            `❌ [STRIPE] Order creation failed:`,
            orderError.message
          );

          // If order creation fails, don't proceed with payment
          return res.status(400).json({
            success: false,
            message: "Order creation failed. Payment not processed.",
            error: orderError.message,
          });
        }
      }

      // 2. NOW TRY TO CONFIRM PAYMENT
      try {
        paymentIntent = await stripeService.confirmPaymentIntent(
          paymentIntentId,
          {
            payment_method: paymentMethodId,
            return_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/purchase-history`,
          }
        );

        console.log(
          `💳 [STRIPE] Payment status: ${paymentIntent.status} for order: ${salesOrder?.id}`
        );
      } catch (paymentError) {
        console.error(
          `❌ [STRIPE] Payment confirmation failed:`,
          paymentError.message
        );

        // Payment failed, but order exists - log the failure
        if (salesOrder) {
          const today = new Date().toISOString().slice(0, 10);
          const failedMemo = `**FAILED** - STRIPE Payment - Payment ID: ${paymentIntentId} - Created: ${today} - Status: Payment confirmation failed - Error: ${paymentError.message}`;

          console.log(
            `📝 [STRIPE] Order was created with pending status, payment failed with memo: ${failedMemo}`
          );
        }

        return res.status(400).json({
          success: false,
          message: "Payment confirmation failed",
          error: paymentError.message,
          salesOrder: salesOrder ? { created: true } : null, // No ID returned from NetSuite
          paymentIntentId: paymentIntentId,
        });
      }

      // 3. UPDATE SALES ORDER WITH PAYMENT STATUS (use externalId from creation response)
      if (salesOrder && paymentIntent && salesOrder.externalId) {
        try {
          console.log(`🔍 [STRIPE] Searching for sales order to update payment status using externalId: ${salesOrder.externalId}`);
          
          // Search for the order using externalId via transaction service
          const transactionResults = await transactionService.findByExternalId(
            salesOrder.externalId,
            1, // limit
            0  // offset
          );
          
          if (Array.isArray(transactionResults) && transactionResults.length > 0) {
            const foundOrder = transactionResults[0];
            console.log(`✅ [STRIPE] Found sales order ID: ${foundOrder.id} for payment update`);
            
            // Create updated memo with payment status
            const today = new Date().toISOString().slice(0, 10);
            const baseInfo = `STRIPE Payment - Payment ID: ${paymentIntent.id} - Created: ${today}`;
            let finalMemo = "";

            switch (paymentIntent.status) {
              case "succeeded":
                finalMemo = `**SUCCESSFUL** - ${baseInfo} - Status: Payment confirmed successfully`;
                break;
              case "requires_action":
                finalMemo = `**PENDING** - ${baseInfo} - Status: Payment requires additional action (3D Secure)`;
                break;
              case "requires_payment_method":
                finalMemo = `**FAILED** - ${baseInfo} - Status: Payment requires valid payment method`;
                break;
              case "processing":
                finalMemo = `**PROCESSING** - ${baseInfo} - Status: Payment is being processed`;
                break;
              case "canceled":
                finalMemo = `**CANCELED** - ${baseInfo} - Status: Payment was canceled`;
                break;
              case "payment_failed":
                finalMemo = `**FAILED** - ${baseInfo} - Status: Payment failed`;
                break;
              case "requires_confirmation":
                finalMemo = `**PENDING** - ${baseInfo} - Status: Payment requires confirmation`;
                break;
              default:
                finalMemo = `**UNKNOWN** - ${baseInfo} - Status: ${paymentIntent.status}`;
            }
            
            // Update the sales order with payment status
            await restApiService.patchRecord("salesOrder", foundOrder.id, {
              memo: finalMemo
            });
            
            console.log(`� [STRIPE] Updated sales order ${foundOrder.id} with payment status: ${paymentIntent.status}`);
            console.log(`📝 [STRIPE] Updated memo: ${finalMemo}`);
            
            // Update our local salesOrder object for response
            salesOrder = {
              ...salesOrder,
              id: foundOrder.id,
              memo: finalMemo
            };
          } else {
            console.warn(`⚠️ [STRIPE] Could not find sales order with externalId: ${salesOrder.externalId}`);
            console.log(`🔍 [STRIPE] Transaction search results:`, transactionResults);
          }
        } catch (updateError) {
          console.error(`❌ [STRIPE] Failed to update sales order with payment status:`, updateError.message);
          // Don't throw error - order was created successfully, update is nice-to-have
        }
      } else if (salesOrder && paymentIntent && !salesOrder.externalId) {
        console.warn(`⚠️ [STRIPE] Sales order was created but no externalId available for payment status update`);
      }

      // 4. RETURN SUCCESS RESPONSE
      if (orderData && salesOrder) {
        res.status(200).json({
          success: paymentIntent.status === "succeeded",
          paymentIntent: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            client_secret: paymentIntent.client_secret,
            next_action: paymentIntent.next_action,
            charges: paymentIntent.charges,
          },
          salesOrder: { 
            created: true,
            id: salesOrder.id || null, // Include ID if we found it
            memo: salesOrder.memo || null, // Include updated memo
            externalId: salesOrder.externalId || null // Include externalId for tracking
          },
          message:
            paymentIntent.status === "succeeded"
              ? "Order created and payment confirmed successfully"
              : `Order created, payment status: ${paymentIntent.status}`,
        });
      } else {
        // No order data provided
        res.status(200).json({
          success: paymentIntent.status === "succeeded",
          paymentIntent: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            client_secret: paymentIntent.client_secret,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            next_action: paymentIntent.next_action,
            charges: paymentIntent.charges,
          },
          message:
            paymentIntent.status === "succeeded"
              ? "Payment confirmed successfully"
              : "Payment requires additional action",
        });
      }
    } catch (err) {
      console.error("Error in payment confirmation process:", err);
      res.status(500).json({
        success: false,
        message: "Unexpected error in payment process",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
        salesOrder: salesOrder ? { created: true } : null, // No ID returned from NetSuite
      });
    }
  }
}

module.exports = new StripeController();
module.exports.toCents = toCents;
