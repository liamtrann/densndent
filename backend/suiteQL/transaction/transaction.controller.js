// transaction/transaction.controller.js
const transactionService = require('./transaction.service');

exports.getTransactionById = async (req, res) => {
    try {
        const { userId, limit, offset } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }
        const transaction = await transactionService.findByEntityId(userId, limit, offset);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTransactionByEmail = async (req, res) => {
    try {
        const { email, limit, offset } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'email is required' });
        }
        const transaction = await transactionService.findByEmail(email, limit, offset);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getItemsByUserOrderHistory = async (req, res) => {
    try {
        const { userId, limit, offset } = req.query;

        // User validation already done by middleware, customer info available in req.validatedCustomer
        const transaction = await transactionService.findByUserOrderHistory(userId, limit, offset);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrderDetailsByTransaction = async (req, res) => {
    try {
        const { transactionId, limit, offset } = req.query;

        if (!transactionId) {
            return res.status(400).json({ error: 'transactionId is required' });
        }

        const orderDetails = await transactionService.getOrderDetailsByTransaction(transactionId, limit, offset);

        if (!orderDetails || orderDetails.length === 0) {
            return res.status(404).json({ error: 'Order details not found for this transaction' });
        }

        res.json({
            success: true,
            transactionId: transactionId,
            itemCount: orderDetails.length,
            orderDetails: orderDetails
        });
    } catch (error) {
        console.error('Error getting order details by transaction:', error);
        res.status(500).json({ error: error.message });
    }
};

