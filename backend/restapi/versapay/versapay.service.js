// backend/restapi/versapay/versapay.service.js
const axios = require('axios');

class VersaPayService {
    constructor() {
        this.apiBaseUrl = process.env.VERSAPAY_API_URL || 'https://ecommerce-api-uat.versapay.com/api/v2';
        this.apiToken = process.env.VERSAPAY_API_TOKEN;
        this.apiKey = process.env.VERSAPAY_API_KEY;

        if (!this.apiToken || !this.apiKey) {
            console.warn('VersaPay API credentials not configured');
        }
    }

    async createSession(options = {}) {
        try {
            const payload = {
                gatewayAuthorization: {
                    apiToken: this.apiToken,
                    apiKey: this.apiKey
                },
                options: {
                    paymentTypes: [
                        { type: 'creditCard', enabled: true }
                    ],
                    fields: [
                        { name: 'cardholderName', required: true },
                        { name: 'accountNumber', required: true },
                        { name: 'expirationDate', required: true },
                        { name: 'cvv', required: true }
                    ],
                    avsRules: {
                        rejectAddressMismatch: false,
                        rejectPostCodeMismatch: false,
                        rejectUnknown: false
                    },
                    ...options
                }
            };

            const response = await axios.post(`${this.apiBaseUrl}/sessions`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('VersaPay session creation error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to create payment session');
        }
    }

    async createWallet() {
        try {
            const payload = {
                gatewayAuthorization: {
                    apiToken: this.apiToken,
                    apiKey: this.apiKey
                }
            };

            const response = await axios.post(`${this.apiBaseUrl}/wallets`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('VersaPay wallet creation error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to create wallet');
        }
    }

    async processPayment(sessionId, orderData, paymentToken) {
        try {
            const payload = {
                gatewayAuthorization: {
                    apiToken: this.apiToken,
                    apiKey: this.apiKey
                },
                customerNumber: orderData.customerId,
                orderNumber: orderData.id,
                currency: orderData.currency || 'CAD',
                billingAddress: orderData.billingAddress,
                shippingAddress: orderData.shippingAddress,
                lines: orderData.items.map(item => ({
                    lineNumber: item.itemId,
                    itemNumber: item.itemId,
                    description: item.name,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    lineAmount: item.price * item.quantity
                })),
                shippingAmount: orderData.shippingAmount || 0,
                discountAmount: orderData.discountAmount || 0,
                taxAmount: orderData.taxAmount || 0,
                payment: {
                    type: 'creditCard',
                    token: paymentToken,
                    amount: orderData.totalAmount,
                    capture: true
                }
            };

            const response = await axios.post(`${this.apiBaseUrl}/sessions/${sessionId}/sales`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('VersaPay payment processing error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Payment processing failed');
        }
    }

    async finalizeOrder(sessionId, saleId) {
        try {
            const payload = {
                gatewayAuthorization: {
                    apiToken: this.apiToken,
                    apiKey: this.apiKey
                }
            };

            const response = await axios.patch(`${this.apiBaseUrl}/sessions/${sessionId}/sales/${saleId}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('VersaPay order finalization error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to finalize order');
        }
    }
}

module.exports = new VersaPayService();
