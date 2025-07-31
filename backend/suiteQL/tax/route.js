const express = require('express');
const router = express.Router();
const taxController = require('./tax.controller');

// Get tax rates by location
router.get('/rates', taxController.getTaxRates);

// Get tax calculation for cart
router.post('/calculate', taxController.calculateTax);

// Get tax rates by postal code
// router.get('/rates/:country/:postalCode', taxController.getTaxRatesByPostalCode);

module.exports = router;
