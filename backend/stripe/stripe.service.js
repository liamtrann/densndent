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
}

module.exports = new StripeService();
