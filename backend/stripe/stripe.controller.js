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
}

module.exports = new StripeController();
