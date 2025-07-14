const inventoryService = require('./inventory.service');

exports.postCheckInventory = async (req, res) => {
    try {
        let { ids } = req.body;
        if (!ids) {
            return res.status(400).json({ error: 'ids is required in body' });
        }
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'ids must be a non-empty array' });
        }
        const inventory = await inventoryService.checkInventoryBalances(ids);
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
