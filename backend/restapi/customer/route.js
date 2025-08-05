const express = require('express');
const router = express.Router();
const customerController = require('./customer.controller');

// Customer-specific routes
router.post('/', customerController.createCustomer);      // POST /customer
router.get('/:id', customerController.getCustomer);       // GET /customer/:id
router.patch('/:id', customerController.updateCustomer);  // PATCH /customer/:id

module.exports = router;
