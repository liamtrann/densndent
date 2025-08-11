const express = require('express');
const router = express.Router();
const recurringOrderController = require('./recurringOrder.controller');

// Recurring order routes
router.post('/', recurringOrderController.createRecurringOrder);       // POST /customrecord_recurring_order
// router.get('/search', recurringOrderController.searchRecurringOrders); // GET /customrecord_recurring_order/search
// router.get('/:id', recurringOrderController.getRecurringOrder);        // GET /customrecord_recurring_order/:id
router.patch('/:id', recurringOrderController.updateRecurringOrder);   // PATCH /customrecord_recurring_order/:id

module.exports = router;
