const express = require('express');
const router = express.Router();
const controller = require('./inventory.controller');

// POST /suiteql/inventory/check
router.post('/check-inventory', controller.postCheckInventory);

module.exports = router;
