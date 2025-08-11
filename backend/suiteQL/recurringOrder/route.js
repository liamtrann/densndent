const express = require('express');
const router = express.Router();
const controller = require('./recurringOrder.controller');

// Get all due recurring orders (orders that need to be processed)
router.get('/due', controller.getDueOrders);

// Get all recurring orders (with optional customerId query parameter)
router.get('/', controller.getAllRecurringOrders);

// Get active recurring orders only
router.get('/active', controller.getActiveRecurringOrders);

// Get recurring order by ID
router.get('/:id', controller.getRecurringOrderById);

module.exports = router;
