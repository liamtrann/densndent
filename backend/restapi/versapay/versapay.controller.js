// backend/restapi/versapay/versapay.controller.js
const versaPayService = require('./versapay.service');

// Create VersaPay session
const createSession = async (req, res, next) => {
    try {
        const { options } = req.body;

        const session = await versaPayService.createSession(options);

        res.status(201).json({
            success: true,
            sessionId: session.id
        });
    } catch (err) {
        console.error('Error creating VersaPay session:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Failed to create payment session'
        });
    }
};

// Create VersaPay wallet
const createWallet = async (req, res, next) => {
    try {
        const wallet = await versaPayService.createWallet();

        res.status(201).json({
            success: true,
            walletId: wallet.walletId
        });
    } catch (err) {
        console.error('Error creating VersaPay wallet:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Failed to create wallet'
        });
    }
};

// Process payment through VersaPay
const processPayment = async (req, res, next) => {
    try {
        const { sessionId, orderData, paymentToken } = req.body;

        if (!sessionId || !orderData || !paymentToken) {
            return res.status(400).json({
                success: false,
                message: 'Session ID, order data, and payment token are required'
            });
        }

        const result = await versaPayService.processPayment(sessionId, orderData, paymentToken);

        res.status(200).json({
            success: true,
            orderId: result.orderId,
            finalized: result.finalized,
            payment: result.payment
        });
    } catch (err) {
        console.error('Error processing VersaPay payment:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Payment processing failed'
        });
    }
};

// Finalize order
const finalizeOrder = async (req, res, next) => {
    try {
        const { sessionId, saleId } = req.body;

        if (!sessionId || !saleId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID and sale ID are required'
            });
        }

        const result = await versaPayService.finalizeOrder(sessionId, saleId);

        res.status(200).json({
            success: true,
            orderId: result.orderId,
            finalized: result.finalized
        });
    } catch (err) {
        console.error('Error finalizing VersaPay order:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Failed to finalize order'
        });
    }
};

module.exports = {
    createSession,
    createWallet,
    processPayment,
    finalizeOrder
};
