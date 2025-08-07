// src/services/versaPayService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class VersaPayService {
    async createSession(options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}/versapay/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ options })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to create session: ${response.statusText}`);
            }

            const data = await response.json();
            return data.sessionId;
        } catch (error) {
            console.error('Error creating VersaPay session:', error);
            throw error;
        }
    }

    async createWallet() {
        try {
            const response = await fetch(`${API_BASE_URL}/versapay/wallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to create wallet: ${response.statusText}`);
            }

            const data = await response.json();
            return data.walletId;
        } catch (error) {
            console.error('Error creating VersaPay wallet:', error);
            throw error;
        }
    }

    async processPayment(sessionId, orderData, paymentToken) {
        try {
            const response = await fetch(`${API_BASE_URL}/versapay/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
                    orderData,
                    paymentToken
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Payment processing failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error processing VersaPay payment:', error);
            throw error;
        }
    }
}

export default new VersaPayService();
