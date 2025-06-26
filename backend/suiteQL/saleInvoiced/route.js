const express = require('express');
const router = express.Router();
const controller = require('./saleInvoiced.controller');

router.get('/top-sale', controller.getTopSalesInvoiced);

module.exports = router;
