// order.route.js
const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');

// POST /restapi/order - create a new order
router.post('/', orderController.createOrder);

// GET /restapi/order/:id - get order by ID
router.get('/:id', orderController.getOrderById);

// GET /restapi/order - list all orders
router.get('/', orderController.listOrders);

module.exports = router;
