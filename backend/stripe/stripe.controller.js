const stripeService = require("./stripe.service");
const restApiService = require("../restapi/restapi.service");

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

// Order creation logic (moved from queue)
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

  // Use provided memo or create default memo with Stripe payment information
  const today = new Date().toISOString().slice(0, 10);
  const memo =
    orderData.orderPayload.memo ||
    (orderData.stripePaymentIntentId
      ? `STRIPE Payment - Payment ID: ${orderData.stripePaymentIntentId} - Created: ${today}`
      : `STRIPE Payment - Created: ${today}`);

  // Add memo to order data (use existing memo if provided)
  const finalOrderData = {
    ...orderData.orderPayload,
    memo: memo,
    stripePaymentIntentId: orderData.stripePaymentIntentId,
  };

  console.log(`📝 [STRIPE] Using memo: ${memo}`);
  

  try {
    console.log(`🚀 [STRIPE] Sending order to NetSuite...`);

    const salesOrder = await restApiService.postRecord(
      "salesOrder",
      finalOrderData
    );

    console.log(
      `💰 [STRIPE] Created sales order ID: ${salesOrder.id} for payment: ${orderData.stripePaymentIntentId}`
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

    console.log(`✅ [STRIPE] Sales order creation completed successfully.: ${salesOrder}`);

    return salesOrder;
  } catch (error) {
    console.error(`❌ [STRIPE] Sales order creation failed:`, {
      error: error.message,
      customerId: orderData.orderPayload?.entity?.id,
      itemCount: orderData.orderPayload?.item?.items?.length || 0,
      paymentIntentId: orderData.stripePaymentIntentId,
      email: orderData.orderPayload?.email,
      memo: memo,
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
          console.log(
            `✅ [STRIPE] Order created (ID: ${salesOrder.id}) for payment: ${paymentIntentId}`
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

      // 3. LOG FINAL PAYMENT STATUS (can't update order since no ID returned)
      if (salesOrder && paymentIntent) {
        const today = new Date().toISOString().slice(0, 10);
        const baseInfo = `STRIPE Payment - Payment ID: ${paymentIntent.id} - Created: ${today}`;
        let finalMemo = "";

        switch (paymentIntent.status) {
          case "succeeded":
            finalMemo = `**SUCCESSFUL** - ${baseInfo} - Status: Payment confirmed successfully`;
            break;
          case "requires_action":
            finalMemo = `**LOADING** - ${baseInfo} - Status: Payment requires additional action (3D Secure or similar)`;
            break;
          case "requires_payment_method":
            finalMemo = `**FAILED** - ${baseInfo} - Status: Payment requires valid payment method`;
            break;
          case "processing":
            finalMemo = `**LOADING** - ${baseInfo} - Status: Payment is being processed`;
            break;
          case "canceled":
            finalMemo = `**FAILED** - ${baseInfo} - Status: Payment was canceled`;
            break;
          case "payment_failed":
            finalMemo = `**FAILED** - ${baseInfo} - Status: Payment failed`;
            break;
          case "requires_confirmation":
            finalMemo = `**LOADING** - ${baseInfo} - Status: Payment requires confirmation`;
            break;
          default:
            finalMemo = `**UNKNOWN** - ${baseInfo} - Status: ${paymentIntent.status}`;
        }

        console.log(`📝 [STRIPE] Final payment status for order: ${finalMemo}`);
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
          salesOrder: { created: true }, // No ID returned from NetSuite
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
