const recurringOrderService = require('./recurringOrder.service');

exports.getDueOrders = async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const orders = await recurringOrderService.getDueOrders(limit, offset);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllRecurringOrders = async (req, res) => {
    console.log('request received for all recurring orders');
    try {
        const { limit, offset, customerId } = req.query;

        // If customerId is provided, get orders for specific customer
        if (customerId) {
            const orders = await recurringOrderService.getRecurringOrdersByCustomer(customerId, limit, offset);
            res.json(orders);
        } else {
            // Otherwise get all recurring orders
            const orders = await recurringOrderService.getAllRecurringOrders(limit, offset);
            res.json(orders);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRecurringOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const order = await recurringOrderService.getRecurringOrderById(id);
        if (!order) {
            return res.status(404).json({ error: 'Recurring order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRecurringOrdersByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { limit, offset } = req.query;

        if (!customerId) {
            return res.status(400).json({ error: 'Customer ID is required' });
        }

        const orders = await recurringOrderService.getRecurringOrdersByCustomer(customerId, limit, offset);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getActiveRecurringOrders = async (req, res) => {
    try {
        const { limit, offset } = req.query;
        const orders = await recurringOrderService.getActiveRecurringOrders(limit, offset);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
