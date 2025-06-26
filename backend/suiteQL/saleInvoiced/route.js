const express = require('express');
const router = express.Router();
const controller = require('./saleInvoiced.controller');

router.get('/top-sale', controller.getTopSalesInvoiced);
router.get('/top-sale-details', controller.getTopSalesWithDetails);

module.exports = router;
