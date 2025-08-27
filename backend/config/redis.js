// Shared Redis configuration for all queues

const redisConfig =
  process.env.NODE_ENV === "production"
    ? {
        // Heroku Redis configuration
        redis: process.env.REDIS_URL,
      }
    : {
        // Local development configuration
        redis: {
          host: "localhost",
          port: 6379,
        },
      };

// Default job options that can be shared across queues
const defaultJobOptions = {
  removeOnComplete: 50,
  removeOnFail: 100,
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 30000, // Default 30 seconds, can be overridden
  },
};

// Queue concurrency based on environment
const getConcurrency = () => (process.env.NODE_ENV === "production" ? 2 : 3);

module.exports = {
  redisConfig,
  defaultJobOptions,
  getConcurrency,
};
