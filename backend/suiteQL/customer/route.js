const express = require('express');
const router = express.Router();
const controller = require('./customer.controller');

router.get('/by-email', controller.getCustomerByEmail);
router.get('/by-stage', controller.getCustomersByStage);

module.exports = router;
