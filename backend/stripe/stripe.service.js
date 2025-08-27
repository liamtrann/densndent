const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class StripeService {
  /**
   * Create a Stripe customer
   * @param {Object} customerData - Customer information
   * @param {string} customerData.name - Customer name
   * @param {string} customerData.email - Customer email
   * @param {string} customerData.phone - Customer phone number
   * @returns {Promise<Object>} Stripe customer object
   */
  async createStripeCustomer({ name, email, phone }) {
    return new Promise(async (resolve, reject) => {
      try {
        const Customer = await stripe.customers.create({
          name: name,
          email: email,
          phone: phone,
        });

        resolve(Customer);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  /**
   * Retrieve a Stripe customer
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<Object>} Stripe customer object
   */
  async retrieveCustomer(customerId) {
    try {
      return await stripe.customers.retrieve(customerId);
    } catch (error) {
      throw new Error(`Failed to retrieve customer: ${error.message}`);
    }
  }

  /**
   * Update a Stripe customer
   * @param {string} customerId - Stripe customer ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated Stripe customer object
   */
  async updateCustomer(customerId, updateData) {
    try {
      return await stripe.customers.update(customerId, updateData);
    } catch (error) {
      throw new Error(`Failed to update customer: ${error.message}`);
    }
  }

  /**
   * Get customer by email
   * @param {string} email - Customer email
   * @returns {Promise<Object|null>} Customer object or null if not found
   */
  async getCustomerByEmail(email) {
    try {
      const customers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      return customers.data.length > 0 ? customers.data[0] : null;
    } catch (error) {
      console.error("Error fetching customer by email:", error);
      throw new Error(`Failed to get customer by email: ${error.message}`);
    }
  }

  /**
   * Delete a Stripe customer
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteCustomer(customerId) {
    try {
      return await stripe.customers.del(customerId);
    } catch (error) {
      throw new Error(`Failed to delete customer: ${error.message}`);
    }
  }

  /**
   * Attach a payment method to a customer
   * @param {string} paymentMethodId - Payment method ID
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<Object>} Payment method object
   */
  async attachPaymentMethod(paymentMethodId, customerId) {
    try {
      return await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * List payment methods for a customer
   * @param {string} customerId - Stripe customer ID
   * @param {string} type - Payment method type (default: 'card')
   * @returns {Promise<Object>} List of payment methods
   */
  async listPaymentMethods(customerId, type = "card") {
    try {
      return await stripe.customers.listPaymentMethods(customerId, {
        type: type,
      });
    } catch (error) {
      throw new Error(`Failed to list payment methods: ${error.message}`);
    }
  }

  /**
   * Detach a payment method from a customer
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<Object>} Payment method object
   */
  async detachPaymentMethod(paymentMethodId) {
    try {
      return await stripe.paymentMethods.detach(paymentMethodId);
    } catch (error) {
      throw new Error(`Failed to detach payment method: ${error.message}`);
    }
  }

  /**
   * Retrieve a payment method
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<Object>} Payment method object
   */
  async retrievePaymentMethod(paymentMethodId) {
    try {
      return await stripe.paymentMethods.retrieve(paymentMethodId);
    } catch (error) {
      throw new Error(`Failed to retrieve payment method: ${error.message}`);
    }
  }
  async createPaymentIntent(paymentData) {
    try {
      return await stripe.paymentIntents.create(paymentData);
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  /**
   * Retrieve a payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Payment intent object
   */
  async retrievePaymentIntent(paymentIntentId) {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      throw new Error(`Failed to retrieve payment intent: ${error.message}`);
    }
  }

  /**
   * Confirm a payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @param {Object} confirmData - Confirmation data
   * @returns {Promise<Object>} Payment intent object
   */
  async confirmPaymentIntent(paymentIntentId, confirmData = {}) {
    try {
      return await stripe.paymentIntents.confirm(paymentIntentId, confirmData);
    } catch (error) {
      throw new Error(`Failed to confirm payment intent: ${error.message}`);
    }
  }
}

module.exports = new StripeService();
