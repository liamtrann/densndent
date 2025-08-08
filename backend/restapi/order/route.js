const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');

// Order-specific routes
router.post('/', orderController.createSalesOrder);     // POST /salesorder
router.get('/:id', orderController.getSalesOrder);     // GET /salesorder/:id
router.patch('/:id', orderController.updateOrderStatus); // PATCH /salesorder/:id

module.exports = router;
