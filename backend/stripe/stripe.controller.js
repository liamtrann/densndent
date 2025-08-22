const stripeService = require("./stripe.service");

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
    const { paymentIntent, paymentMethod } = req.body;

    // Basic validation
    if (!paymentIntent) {
      return res.status(400).json({
        message: "Payment intent ID is required",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    try {
      const intent = await stripeService.confirmPaymentIntent(paymentIntent, {
        payment_method: paymentMethod,
        return_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/purchase-history`,
      });

      /* Update the status of the payment to indicate confirmation */
      res.status(200).json({
        paymentIntent: {
          id: intent.id,
          status: intent.status,
          client_secret: intent.client_secret,
          amount: intent.amount,
          currency: intent.currency,
          next_action: intent.next_action,
          charges: intent.charges,
        },
      });
    } catch (err) {
      console.error("Error confirming payment:", err);
      res.status(500).json({
        message: "Could not confirm payment",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
}

module.exports = new StripeController();
