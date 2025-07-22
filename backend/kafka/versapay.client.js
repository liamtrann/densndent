const axios = require('axios');
require('dotenv').config();

class VersaPayClient {
  constructor() {
    this.apiToken = process.env.VERSAPAY_API_TOKEN;
    this.baseURL = process.env.VERSAPAY_BASE_URL || 'https://api-sandbox.versapay.com';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Token ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  async createCustomer(customerData) {
    try {
      const response = await this.client.post('/api/customers/', {
        name: customerData.name,
        email: customerData.email,
        customer_number: customerData.customerNumber || `CUST-${Date.now()}`
      });
      return response.data;
    } catch (error) {
      console.error('VersaPay Customer Creation Error:', error.response?.data || error.message);
      throw new Error(`Customer creation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async createInvoice(invoiceData) {
    try {
      const response = await this.client.post('/api/invoices/', {
        customer: invoiceData.customerId,
        invoice_number: invoiceData.invoiceNumber || `INV-${Date.now()}`,
        total: invoiceData.total.toString(),
        currency: invoiceData.currency || 'CAD',
        due_date: invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        line_items: invoiceData.lineItems || [
          {
            description: 'Order Payment',
            quantity: 1,
            unit_price: invoiceData.total.toString()
          }
        ]
      });
      return response.data;
    } catch (error) {
      console.error('VersaPay Invoice Creation Error:', error.response?.data || error.message);
      throw new Error(`Invoice creation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async createGatewayTransaction(transactionData) {
    try {
      const response = await this.client.post('/api/gateway_transactions/', {
        fund_source: 'credit_card',
        amount: transactionData.amount.toString(),
        currency: transactionData.currency || 'CAD',
        customer: transactionData.customerId,
        invoice: transactionData.invoiceId,
        reference: transactionData.reference || `TXN-${Date.now()}`
      });
      return response.data;
    } catch (error) {
      console.error('VersaPay Gateway Transaction Error:', error.response?.data || error.message);
      throw new Error(`Gateway transaction failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async getTransactionStatus(transactionId) {
    try {
      const response = await this.client.get(`/api/gateway_transactions/${transactionId}/`);
      return response.data;
    } catch (error) {
      console.error('VersaPay Get Transaction Error:', error.response?.data || error.message);
      throw new Error(`Get transaction failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = VersaPayClient;
