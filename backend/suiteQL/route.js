const express = require('express');
const router = express.Router();

const classificationRoutes = require('./classification/route');
const itemsRoute = require('./item/route');
const fileRoute = require('./file/route');
const pricingRoute = require('./pricing/route');
const saleInvoicedRoute = require('./saleInvoiced/route');
const customerRoute = require('./customer/route');
const brandsRoute = require('./brands/route');
const transactionRoute = require('./transaction/route');

router.use('/classification', classificationRoutes);
router.use('/item', itemsRoute);
router.use('/file', fileRoute);
router.use('/pricing', pricingRoute);
router.use('/saleInvoiced', saleInvoicedRoute);
router.use('/customer', customerRoute);
router.use('/brands', brandsRoute);
router.use('/transaction', transactionRoute);

module.exports = router;
