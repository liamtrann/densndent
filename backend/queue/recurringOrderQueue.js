const Queue = require("bull");
const restApiService = require("../restapi/restapi.service");
const {
  redisConfig,
  defaultJobOptions,
  getConcurrency,
} = require("../config/redis");

// Create the queue with production config
let recurringOrderQueue;

try {
  recurringOrderQueue = new Queue("recurring orders", {
    ...redisConfig,
    defaultJobOptions,
  });

  console.log("✅ [RECURRING-QUEUE] Successfully connected to Redis");
} catch (error) {
  console.error(
    "❌ [RECURRING-QUEUE] Failed to connect to Redis:",
    error.message
  );
  console.log(
    "💡 [RECURRING-QUEUE] To fix this, start Redis with: docker run -d -p 6379:6379 redis:alpine"
  );
  console.log("🔄 [RECURRING-QUEUE] Falling back to synchronous processing...");

  // Set to null so we can handle fallback
  recurringOrderQueue = null;
}

// Process jobs with concurrency appropriate for environment
const concurrency = getConcurrency();

if (recurringOrderQueue) {
  console.log(
    `🔧 [RECURRING-QUEUE] Setting up worker with concurrency: ${concurrency}`
  );

  recurringOrderQueue.process("process-order", concurrency, async (job) => {
    const orderData = job.data;
    console.log(
      `🔨 [RECURRING-QUEUE] Worker picked up job ${job.id} - Processing order ID: ${orderData.id} for customer: ${orderData.customerid}`
    );

    try {
      const result = await processOrderLogic(orderData);
      console.log(
        `✅ [RECURRING-QUEUE] Worker completed job ${job.id} successfully`
      );
      return result;
    } catch (error) {
      console.error(
        `❌ [RECURRING-QUEUE] Worker failed job ${job.id}:`,
        error.message
      );
      throw error;
    }
  });

  // Event handlers for production monitoring
  recurringOrderQueue.on("completed", (job, result) => {
    console.log(
      `🎉 [RECURRING-QUEUE] Job ${job.id} completed successfully - Order ${job.data.id}`
    );
  });

  recurringOrderQueue.on("failed", (job, err) => {
    console.error(
      `💥 [RECURRING-QUEUE] Job ${job.id} failed after ${job.attemptsMade} attempts:`,
      err.message
    );

    // Log to external service in production
    if (process.env.NODE_ENV === "production") {
      console.error(`❌ [PRODUCTION] Queue job failed:`, {
        jobId: job.id,
        orderId: job.data.id,
        customerId: job.data.customerid,
        error: err.message,
        attempts: job.attemptsMade,
      });
    }
  });

  recurringOrderQueue.on("waiting", (jobId) => {
    console.log(`⏳ [RECURRING-QUEUE] Job ${jobId} is waiting to be processed`);
  });

  recurringOrderQueue.on("active", (job, jobPromise) => {
    console.log(`🏃 [RECURRING-QUEUE] Job ${job.id} started processing`);
  });
} else {
  console.log(
    "⚠️ [RECURRING-QUEUE] Redis not available, queue processing disabled"
  );
}

async function enqueueOrder(orderData) {
  console.log(
    `🔍 [RECURRING-QUEUE] Processing order ${orderData.id} for customer ${orderData.customerid}...`
  );

  // For local development, just process synchronously since Redis is having issues
  if (process.env.NODE_ENV !== "production") {
    console.log(
      "� [DEV] Processing order synchronously (Redis disabled for development)..."
    );
    return await processOrderLogic(orderData);
  }

  // If Redis is not available, process synchronously
  if (!recurringOrderQueue) {
    console.log(
      "⚠️ [RECURRING-QUEUE] Redis not available, processing order synchronously..."
    );
    return await processOrderLogic(orderData);
  }

  try {
    console.log(
      `🔍 [RECURRING-QUEUE] Adding job to queue for order ${orderData.id}...`
    );

    // Add timeout to the operation
    const jobPromise = recurringOrderQueue.add("process-order", orderData, {
      priority: orderData.priority || 1,
      delay: 1000, // 1 second delay
    });

    // Wait max 5 seconds for the job to be added
    const job = await Promise.race([
      jobPromise,
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Job enqueue timeout after 5 seconds")),
          5000
        )
      ),
    ]);

    console.log(
      `📤 [RECURRING-QUEUE] Successfully enqueued order ${orderData.id} as job ${job.id}`
    );
    return job;
  } catch (error) {
    console.error(
      `❌ [RECURRING-QUEUE] Failed to enqueue order ${orderData.id}:`,
      error.message
    );
    console.log(
      "🔄 [RECURRING-QUEUE] Falling back to synchronous processing..."
    );
    return await processOrderLogic(orderData);
  }
}

async function processOrderLogic(order) {
  // Validate order data first
  if (!order.customerid || order.customerid === "undefined") {
    throw new Error(`Invalid customer ID: ${order.customerid}`);
  }

  if (!order.itemid || order.itemid === "undefined") {
    throw new Error(`Invalid item ID: ${order.itemid}`);
  }

  console.log(
    `🔍 [RECURRING-QUEUE] Processing recurring order ${order.id} for customer ${order.customerid}`
  );

  // Step 1: Create sales order first
  const today = new Date().toISOString().slice(0, 10);
  const externalId = `recurring-${order.id}-${today}`;

  const salesOrderBody = {
    entity: { id: order.customerid },
    item: {
      items: [
        {
          item: { id: order.itemid },
          quantity: Number(order.quantity) || 1,
        },
      ],
    },
    shipMethod: {
      id: "20412",
    },
    tobeEmailed: true,
    externalId: externalId,
    memo: `Recurring order ${order.id} - Created: ${today}`,
  };

  let salesOrder = null;
  let paymentResult = null;

  try {
    // Create sales order via REST API
    salesOrder = await restApiService.postRecord("salesOrder", salesOrderBody);
    console.log(
      `💰 [RECURRING-QUEUE] Created sales order with external ID: ${externalId} for recurring order: ${order.id}`
    );

    // Step 2: Retrieve the created sales order using externalId to get the calculated total
    const transactionService = require("../suiteQL/transaction/transaction.service");

    // Wait a moment for NetSuite to process the order before retrieving
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const retrievedOrders = await transactionService.findByExternalId(
      externalId,
      1,
      0
    );

    if (!retrievedOrders || retrievedOrders.length === 0) {
      throw new Error(
        `Could not retrieve sales order with external ID: ${externalId}`
      );
    }

    const retrievedOrder = retrievedOrders[0];
    const salesOrderId = retrievedOrder.id; // Get the actual sales order ID from retrieved data

    // Extract the total amount from the retrieved sales order
    const orderTotal =
      parseFloat(
        retrievedOrder.foreigntotal || retrievedOrder.totalcostestimate
      ) || 0;
    const stripeAmount = Math.round(orderTotal * 100); // Convert to cents for Stripe

    console.log(
      `💵 [RECURRING-QUEUE] Sales order ${salesOrderId} (External ID: ${externalId}) total: $${orderTotal.toFixed(2)}`
    );

    // Step 3: Charge customer if there's an amount to charge and we have customer email
    if (orderTotal > 0 && order.customeremail) {
      try {
        const stripeService = require("../stripe/stripe.service");

        // Find or create Stripe customer by email
        let stripeCustomer = await stripeService.getCustomerByEmail(
          order.customeremail
        );

        if (!stripeCustomer) {
          stripeCustomer = await stripeService.createStripeCustomer({
            name: `Customer ${order.customerid}`,
            email: order.customeremail,
            phone: null,
          });
          console.log(
            `� [RECURRING-QUEUE] Created new Stripe customer for ${order.customeremail}`
          );
        }

        // Get customer's payment methods
        const paymentMethods = await stripeService.listPaymentMethods(
          stripeCustomer.id,
          "card"
        );

        if (paymentMethods.data.length === 0) {
          throw new Error(
            `No payment methods found for customer ${order.customeremail}`
          );
        }

        const defaultPaymentMethod = paymentMethods.data[0];

        // Create payment intent
        const paymentIntent = await stripeService.createPaymentIntent({
          amount: stripeAmount, // Amount in cents
          currency: "usd", // or your preferred currency
          customer: stripeCustomer.id,
          payment_method: defaultPaymentMethod.id,
          confirmation_method: "automatic",
          confirm: true,
          return_url: process.env.FRONTEND_URL || "http://localhost:3000",
          description: `Sales Order ${salesOrderId} - Recurring order ${order.id} - ${order.displayname || "Subscription item"}`,
          metadata: {
            sales_order_id: salesOrderId,
            external_id: externalId,
            recurring_order_id: order.id,
            customer_id: order.customerid,
            item_id: order.itemid,
            order_total: orderTotal.toString(),
          },
        });

        // Check if payment was successful (since we used confirm: true)
        if (paymentIntent.status === "succeeded") {
          paymentResult = {
            paymentIntentId: paymentIntent.id,
            amount: orderTotal,
            currency: paymentIntent.currency,
            stripeCustomerId: stripeCustomer.id,
          };
          console.log(
            `✅ [RECURRING-QUEUE] Payment successful: ${paymentIntent.id} - $${orderTotal.toFixed(2)}`
          );

          // Step 4: Update sales order memo with payment information
          try {
            await restApiService.patchRecord("salesOrder", salesOrderId, {
              memo: `Recurring order ${order.id} - STRIPE Payment ID: ${paymentIntent.id} - Amount: $${orderTotal.toFixed(2)} - Charged: ${today}`,
            });
            console.log(
              `📝 [RECURRING-QUEUE] Updated sales order ${salesOrderId} with payment information`
            );
          } catch (memoUpdateError) {
            console.warn(
              `⚠️ [RECURRING-QUEUE] Failed to update sales order memo: ${memoUpdateError.message}`
            );
            // Don't fail the entire process for memo update failure
          }
        } else {
          throw new Error(
            `Payment confirmation failed with status: ${paymentIntent.status}`
          );
        }
      } catch (paymentError) {
        console.error(
          `❌ [RECURRING-QUEUE] Payment failed for sales order ${salesOrderId} (External ID: ${externalId}):`,
          paymentError.message
        );

        // Update sales order memo to indicate payment failure
        try {
          await restApiService.patchRecord("salesOrder", salesOrderId, {
            memo: `Recurring order ${order.id} - STRIPE PAYMENT FAILED: ${paymentError.message} - Total: $${orderTotal.toFixed(2)} - ${today}`,
          });
        } catch (memoError) {
          console.warn(
            `⚠️ [RECURRING-QUEUE] Failed to update sales order memo with payment failure: ${memoError.message}`
          );
        }

        // Decide whether to continue or fail the entire process
        // Option 1: Fail the entire process (recommended for recurring orders)
        throw new Error(
          `Payment failed for sales order ${salesOrderId}: ${paymentError.message}`
        );

        // Option 2: Continue without payment (uncomment if needed)
        // console.log(`⚠️ [RECURRING-QUEUE] Continuing with unpaid sales order ${salesOrderId}`);
      }
    } else if (orderTotal <= 0) {
      console.log(
        `💸 [RECURRING-QUEUE] Skipping payment for sales order ${salesOrderId} - Amount: $${orderTotal.toFixed(2)} (free order)`
      );

      // Update memo for free orders
      try {
        await restApiService.patchRecord("salesOrder", salesOrderId, {
          memo: `Recurring order ${order.id} - FREE ORDER - Total: $${orderTotal.toFixed(2)} - ${today}`,
        });
      } catch (memoError) {
        console.warn(
          `⚠️ [RECURRING-QUEUE] Failed to update free order memo: ${memoError.message}`
        );
      }
    } else {
      console.log(
        `📧 [RECURRING-QUEUE] Skipping payment for sales order ${salesOrderId} - No customer email provided`
      );

      // Update memo for orders without email
      try {
        await restApiService.patchRecord("salesOrder", salesOrderId, {
          memo: `Recurring order ${order.id} - NO EMAIL PROVIDED - STRIPE PAYMENT Total: $${orderTotal.toFixed(2)} - ${today}`,
        });
      } catch (memoError) {
        console.warn(
          `⚠️ [RECURRING-QUEUE] Failed to update no-email memo: ${memoError.message}`
        );
      }
    }

    // Step 5: Update next run date only if order creation was successful
    await updateNextRunDate(order);
    console.log(
      `📅 [RECURRING-QUEUE] Updated next run date for recurring order: ${order.id}`
    );

    return {
      salesOrder: {
        id: salesOrderId,
        externalId: externalId,
        transactionnumber: retrievedOrder.transactionnumber,
      },
      payment: paymentResult,
      orderTotal: orderTotal,
      processingDetails: {
        externalId,
        itemId: order.itemid,
        quantity: Number(order.quantity) || 1,
        customerEmail: order.customeremail,
        processingDate: today,
      },
    };
  } catch (orderCreationError) {
    console.error(
      `❌ [RECURRING-QUEUE] Sales order creation failed for recurring order ${order.id}:`,
      {
        error: orderCreationError.message,
        orderData: salesOrderBody,
        customerId: order.customerid,
        itemId: order.itemid,
      }
    );

    throw new Error(
      `Sales order creation failed: ${orderCreationError.message}`
    );
  }
}

async function updateNextRunDate(order) {
  try {
    // Calculate next run date based on interval and intervalUnit
    const currentDate = new Date(order.nextrun || new Date());
    const interval = parseInt(order.interval) || 1;
    const intervalunit = (order.intervalunit || "month").toLowerCase();

    // Calculate next run date based on interval unit
    const nextRunDate = new Date(currentDate);

    switch (intervalunit) {
      case "week":
        nextRunDate.setDate(currentDate.getDate() + interval * 7);
        break;

      case "month":
        nextRunDate.setMonth(currentDate.getMonth() + interval);
        break;

      default:
        console.warn(
          `⚠️ [RECURRING-QUEUE] Unknown interval unit '${order.intervalunit}' for order ${order.id}, defaulting to week`
        );
        nextRunDate.setDate(currentDate.getDate() + interval * 7);
    }

    // Format date as YYYY-MM-DD for NetSuite
    const nextRunFormatted = nextRunDate.toISOString().slice(0, 10);

    // Update the recurring order with new next run date
    await restApiService.patchRecord("customrecord_recurring_order", order.id, {
      custrecord_ro_next_run: nextRunFormatted,
    });

    console.log(
      `📅 [RECURRING-QUEUE] Updated next run date for order ${order.id}: ${nextRunFormatted} (${interval} ${intervalunit})`
    );
  } catch (error) {
    console.error(
      `❌ [RECURRING-QUEUE] Failed to update next run date for order ${order.id}:`,
      error.message
    );
    // Don't throw error here - we still want to consider the order processing successful
  }
}

// Graceful shutdown for Heroku
process.on("SIGTERM", async () => {
  console.log(
    "🛑 [RECURRING-QUEUE] Received SIGTERM, shutting down gracefully..."
  );
  if (recurringOrderQueue) {
    await recurringOrderQueue.close();
  }
  process.exit(0);
});

module.exports = { recurringOrderQueue, enqueueOrder };
