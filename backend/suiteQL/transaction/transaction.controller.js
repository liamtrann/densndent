// transaction/transaction.controller.js
const transactionService = require('./transaction.service');

exports.getTransactionById = async (req, res) => {
    try {
        const { id, limit, offset } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'id is required' });
        }
        const transaction = await transactionService.findByEntityId(id, limit, offset);
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
exports.getItemsByTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'id is required' });
        }
        const items = await transactionService.getItemsByTransaction(id);
        res.json({ items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
