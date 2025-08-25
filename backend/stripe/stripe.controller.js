const stripeService = require("./stripe.service");
const restApiService = require("../restapi/restapi.service");
const {
  enqueueStripeOrder,
  checkJobStatus,
} = require("../queue/stripeOrderQueue");

class StripeController {
  /**
   * Create Stripe customer for existing customer
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
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

      // TODO: Update existing customer in your database with customer.id
      // Example:
      // await Customer.update(
      //   { stripeCustomerId: customer.id },
      //   { where: { email: email } }
      // );

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

  /**
   * Get customer information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
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

  /**
   * Update customer information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
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

  /**
   * Get customer by email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
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

  /**
   * Attach payment method to customer
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
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

  /**
   * List payment methods for customer
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
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

  /**
   * Detach payment method from customer
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
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

  /**
   * Create payment intent
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
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
        amount: amount * 100, // Convert to cents
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

  /**
   * Confirm payment intent
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async confirmPayment(req, res) {
    const { paymentMethodId, paymentIntentId, orderData } = req.body;

    console.log(paymentMethodId);
    console.log(paymentIntentId);

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

    try {
      // 1. Confirm payment with Stripe
      const paymentIntent = await stripeService.confirmPaymentIntent(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
          return_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/purchase-history`,
        }
      );

      console.log(paymentIntent);

      // 2. If payment successful, create order via queue
      if (paymentIntent.status === "succeeded" && orderData) {
        console.log(
          `💳 [STRIPE] Enqueueing sales order for payment: ${paymentIntent.id}`
        );

        try {
          // Add payment intent ID to order data for tracking
          const orderDataWithPayment = {
            ...orderData,
            stripePaymentIntentId: paymentIntent.id,
          };

          // Enqueue order creation and wait for completion
          const job = await enqueueStripeOrder(
            paymentIntent.id,
            orderDataWithPayment
          );

          // Wait for the job to complete
          console.log(
            `⏳ [STRIPE] Waiting for order creation job ${job?.id} to complete...`
          );

          // Wait for job completion with timeout
          const jobResult = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Order creation timeout after 30 seconds"));
            }, 30000); // 30 second timeout

            // Check job status every 1 second
            const checkStatus = async () => {
              try {
                const status = await checkJobStatus(job?.id);

                if (status.status === "completed") {
                  clearTimeout(timeout);
                  resolve(status);
                } else if (status.status === "failed") {
                  clearTimeout(timeout);
                  reject(new Error(`Order creation failed: ${status.message}`));
                } else {
                  // Job still processing, check again in 1 second
                  setTimeout(checkStatus, 1000);
                }
              } catch (error) {
                clearTimeout(timeout);
                reject(error);
              }
            };

            checkStatus();
          });

          console.log(
            `✅ [STRIPE] Order creation completed successfully for payment: ${paymentIntent.id}`
          );

          res.status(200).json({
            success: true,
            paymentIntent: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              client_secret: paymentIntent.client_secret,
              next_action: paymentIntent.next_action,
              charges: paymentIntent.charges,
            },
            jobId: job?.id,
            jobResult: jobResult,
            message: "Payment confirmed and order created successfully",
          });
        } catch (orderError) {
          console.error(
            `❌ [STRIPE] Order creation failed for payment ${paymentIntent.id}:`,
            orderError.message
          );

          // Payment succeeded but order creation failed
          res.status(200).json({
            success: true,
            paymentIntent: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              client_secret: paymentIntent.client_secret,
              next_action: paymentIntent.next_action,
              charges: paymentIntent.charges,
            },
            orderError: orderError.message,
            message:
              "Payment confirmed but order creation failed. Please contact support.",
          });
        }
      } else {
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
      console.error("Error confirming payment:", err);
      res.status(500).json({
        success: false,
        message: "Could not confirm payment",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }

  /**
   * Check order creation job status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async checkOrderJobStatus(req, res) {
    try {
      const { jobId } = req.params;

      if (!jobId) {
        return res.status(400).json({
          success: false,
          message: "Job ID is required",
        });
      }

      const status = await checkJobStatus(jobId);

      res.status(200).json({
        success: true,
        jobStatus: status,
      });
    } catch (err) {
      console.error("Error checking job status:", err);
      res.status(500).json({
        success: false,
        message: "Could not check job status",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
}

module.exports = new StripeController();
