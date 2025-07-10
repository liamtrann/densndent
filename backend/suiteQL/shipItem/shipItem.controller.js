// backend/suiteQL/shipItem/shipItem.controller.js
const express = require('express');
const router = express.Router();
const ShipItemService = require('./shipItem.service');

// GET /api/ship-items/:orderId
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const method = await ShipItemService.getShippingMethod(id);
        res.json(method);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
