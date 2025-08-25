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

  // Create a unique external ID for recurring orders
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
  const externalId = `recurring-${order.id}-${today}`;

  // Create sales order body
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
  };

  let salesOrder = null;

  try {
    // Create sales order via REST API
    salesOrder = await restApiService.postRecord("salesOrder", salesOrderBody);
    console.log(
      `💰 [RECURRING-QUEUE] Created sales order ID: ${salesOrder.id} for recurring order: ${order.id}`
    );

    // Only update next run date if order creation was successful
    await updateNextRunDate(order);
    console.log(
      `📅 [RECURRING-QUEUE] Updated next run date for recurring order: ${order.id}`
    );

    return salesOrder;
  } catch (orderCreationError) {
    // Log the detailed error but don't update next run date
    console.error(
      `❌ [RECURRING-QUEUE] Sales order creation failed for recurring order ${order.id}:`,
      {
        error: orderCreationError.message,
        orderData: salesOrderBody,
        customerId: order.customerid,
        itemId: order.itemid,
      }
    );

    // Rethrow with more context
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
