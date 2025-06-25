const express = require('express');
const router = express.Router();
const controller = require('./pricing.controller');

router.get('/by-item', controller.getPricingByItemId);

module.exports = router; 