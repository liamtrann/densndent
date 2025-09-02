const Queue = require("bull");
const restApiService = require("../restapi/restapi.service");
const {
  redisConfig,
  defaultJobOptions,
  getConcurrency,
} = require("../config/redis");

// Create Stripe order queue with custom options
let stripeOrderQueue;

try {
  stripeOrderQueue = new Queue("stripe orders", {
    ...redisConfig,
    defaultJobOptions: {
      ...defaultJobOptions,
      backoff: {
        type: "exponential",
        delay: 2000, // Faster retry for Stripe orders (2 seconds vs 30 seconds)
      },
    },
  });

  console.log(
    "✅ [STRIPE-QUEUE] Successfully connected to Redis for Stripe orders"
  );
} catch (error) {
  console.error("❌ [STRIPE-QUEUE] Failed to connect to Redis:", error.message);
  console.log("🔄 [STRIPE-QUEUE] Falling back to synchronous processing...");
  stripeOrderQueue = null;
}

// Process Stripe order jobs with shared concurrency
const concurrency = getConcurrency();

if (stripeOrderQueue) {
  console.log(
    `🔧 [STRIPE-QUEUE] Setting up worker with concurrency: ${concurrency}`
  );

  stripeOrderQueue.process("create-stripe-order", concurrency, async (job) => {
    const { paymentIntentId, orderData } = job.data;
    console.log(
      `🔨 [STRIPE-QUEUE] Processing order for payment: ${paymentIntentId}`
    );

    try {
      const result = await processStripeOrderLogic(orderData);
      console.log(
        `✅ [STRIPE-QUEUE] Order created successfully for payment: ${paymentIntentId}`
      );
      return result;
    } catch (error) {
      console.error(
        `❌ [STRIPE-QUEUE] Order creation failed for payment ${paymentIntentId}:`,
        error.message
      );
      throw error;
    }
  });

  // Event handlers
  stripeOrderQueue.on("completed", (job, result) => {
    console.log(
      `🎉 [STRIPE-QUEUE] Order created successfully for payment ${job.data.paymentIntentId} - Order ID: ${result.id}`
    );
  });

  stripeOrderQueue.on("failed", (job, err) => {
    console.error(
      `💥 [STRIPE-QUEUE] Order creation failed for payment ${job.data.paymentIntentId}:`,
      err.message
    );

    if (process.env.NODE_ENV === "production") {
      console.error(`❌ [PRODUCTION] Stripe order failed:`, {
        jobId: job.id,
        paymentIntentId: job.data.paymentIntentId,
        customerId: job.data.orderData.entity?.id,
        error: err.message,
        attempts: job.attemptsMade,
      });
    }
  });

  stripeOrderQueue.on("waiting", (jobId) => {
    console.log(`⏳ [STRIPE-QUEUE] Job ${jobId} is waiting to be processed`);
  });

  stripeOrderQueue.on("active", (job, jobPromise) => {
    console.log(
      `🏃 [STRIPE-QUEUE] Job ${job.id} started processing Stripe order`
    );
  });
} else {
  console.log(
    "⚠️ [STRIPE-QUEUE] Redis not available, Stripe order processing disabled"
  );
}

// Add function to enqueue Stripe orders
async function enqueueStripeOrder(paymentIntentId, orderData) {
  console.log(
    `🔍 [STRIPE-QUEUE] Processing order for payment: ${paymentIntentId}...`
  );

  // Log order data structure for debugging
  console.log(`📋 [STRIPE-QUEUE] Order data received:`, {
    customerId: orderData.entity?.id,
    itemCount: orderData.item?.items?.length || 0,
    email: orderData.email,
    shipMethod: orderData.shipMethod?.id,
    tobeEmailed: orderData.tobeEmailed,
    hasBillingAddress: !!orderData.billingAddress,
    hasShippingAddress: !!orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
  });

  // If Redis not available, process synchronously
  if (!stripeOrderQueue) {
    console.log(
      "⚠️ [STRIPE-QUEUE] Redis not available, processing order synchronously..."
    );
    return await processStripeOrderLogic(orderData);
  }

  // Check queue health before adding job
  try {
    console.log(`🔧 [STRIPE-QUEUE] Starting queue health check...`);

    // Add timeout to prevent hanging
    const healthCheckPromise = Promise.all([
      stripeOrderQueue.getWaiting(),
      stripeOrderQueue.getActive(),
    ]);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Health check timeout after 5 seconds")),
        5000
      )
    );

    const [waitingCount, activeCount] = await Promise.race([
      healthCheckPromise,
      timeoutPromise,
    ]);

    console.log(`✅ [STRIPE-QUEUE] Got waiting count: ${waitingCount.length}`);
    console.log(`✅ [STRIPE-QUEUE] Got active count: ${activeCount.length}`);

    console.log(
      `📊 [STRIPE-QUEUE] Queue status - Waiting: ${waitingCount.length}, Active: ${activeCount.length}`
    );
  } catch (healthError) {
    console.error(
      `⚠️ [STRIPE-QUEUE] Queue health check failed:`,
      healthError.message
    );
    console.log(`🔄 [STRIPE-QUEUE] Continuing despite health check failure...`);
  }

  try {
    console.log(
      `📥 [STRIPE-QUEUE] Attempting to add job to queue for payment: ${paymentIntentId}`
    );

    console.log(`🔧 [STRIPE-QUEUE] Creating job with data...`);

    // Add timeout to job creation to prevent hanging
    const jobCreationPromise = stripeOrderQueue.add(
      "create-stripe-order",
      {
        paymentIntentId,
        orderData,
      },
      {
        priority: 1,
        attempts: 3, // Limit retry attempts
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Job creation timeout after 10 seconds")),
        10000
      )
    );

    const job = await Promise.race([jobCreationPromise, timeoutPromise]);

    console.log(
      `✅ [STRIPE-QUEUE] Job created successfully with ID: ${job.id}`
    );

    console.log(
      `✅ [STRIPE-QUEUE] Successfully enqueued order for payment ${paymentIntentId} as job ${job.id}`
    );

    // Log job details for debugging
    console.log(`🔍 [STRIPE-QUEUE] Job details:`, {
      jobId: job.id,
      priority: job.opts.priority,
      attempts: job.opts.attempts,
      paymentIntentId: paymentIntentId,
      customerId: orderData.entity?.id,
    });

    return job;
  } catch (error) {
    console.error(
      `❌ [STRIPE-QUEUE] Failed to enqueue order for payment ${paymentIntentId}:`,
      error.message
    );
    console.error(`🔍 [STRIPE-QUEUE] Error details:`, {
      errorName: error.name,
      errorStack: error.stack,
      redisConnection: !!stripeOrderQueue,
    });
    console.log("🔄 [STRIPE-QUEUE] Falling back to synchronous processing...");
    return await processStripeOrderLogic(orderData);
  }
}

// Function to check job status
async function checkJobStatus(jobId) {
  if (!stripeOrderQueue) {
    return { status: "no_queue", message: "Queue not available" };
  }

  try {
    const job = await stripeOrderQueue.getJob(jobId);
    if (!job) {
      return { status: "not_found", message: "Job not found" };
    }

    const state = await job.getState();
    return {
      status: state,
      message: `Job is ${state}`,
      progress: job.progress(),
      attempts: job.attemptsMade,
      maxAttempts: job.opts.attempts,
    };
  } catch (error) {
    return {
      status: "error",
      message: `Error checking job: ${error.message}`,
    };
  }
}

// Process Stripe order logic
async function processStripeOrderLogic(orderData) {
  console.log(`💳 [STRIPE-QUEUE] Creating sales order for Stripe payment...`);

  if (!orderData.entity?.id) {
    throw new Error(`Invalid customer ID: ${orderData.entity?.id}`);
  }

  // Check for items in the NetSuite format (orderData.item.items)
  if (!orderData.item?.items || orderData.item.items.length === 0) {
    console.error(
      "❌ [STRIPE-QUEUE] Order data structure:",
      JSON.stringify(orderData, null, 2)
    );
    throw new Error("No items provided for order");
  }

  console.log(
    `📦 [STRIPE-QUEUE] Processing ${orderData.item.items.length} items for customer ${orderData.entity.id}`
  );
  console.log(`📧 [STRIPE-QUEUE] Order will be emailed to: ${orderData.email}`);

  // Add memo with Stripe payment information
  const today = new Date().toISOString().slice(0, 10);
  const memo = orderData.stripePaymentIntentId
    ? `STRIPE Payment - Payment ID: ${orderData.stripePaymentIntentId} - Created: ${today}`
    : `STRIPE Payment - Created: ${today}`;

  // Add memo to order data
  const finalOrderData = {
    ...orderData,
    memo: memo,
  };

  console.log(`📝 [STRIPE-QUEUE] Adding memo: ${memo}`);

  try {
    console.log(`🚀 [STRIPE-QUEUE] Sending order to NetSuite...`);

    const salesOrder = await restApiService.postRecord(
      "salesOrder",
      finalOrderData
    );

    console.log(
      `💰 [STRIPE-QUEUE] Created sales order ID: ${salesOrder.id} for payment: ${orderData.stripePaymentIntentId}`
    );

    return salesOrder;
  } catch (error) {
    console.error(`❌ [STRIPE-QUEUE] Sales order creation failed:`, {
      error: error.message,
      customerId: orderData.entity?.id,
      itemCount: orderData.item?.items?.length || 0,
      paymentIntentId: orderData.stripePaymentIntentId,
      email: orderData.email,
      memo: memo,
    });

    throw new Error(`Sales order creation failed: ${error.message}`);
  }
}

// Graceful shutdown for Heroku
process.on("SIGTERM", async () => {
  console.log(
    "🛑 [STRIPE-QUEUE] Received SIGTERM, shutting down gracefully..."
  );
  if (stripeOrderQueue) {
    await stripeOrderQueue.close();
  }
});

module.exports = {
  stripeOrderQueue,
  enqueueStripeOrder,
  checkJobStatus,
};
