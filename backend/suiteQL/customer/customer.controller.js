const customerService = require('./customer.service');

exports.getCustomerByEmail = async (req, res) => {
    try {
        const { email, limit, offset } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const customer = await customerService.findByEmail(email, limit, offset);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCustomersByStage = async (req, res) => {
    try {
        let { stage, limit, offset } = req.query;
        if (!stage) {
            return res.status(400).json({ error: 'stage is required' });
        }
        // Normalize: capitalize first letter, lowercase the rest
        stage = stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();
        const customers = await customerService.findByStage(stage, limit, offset);
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
