const express = require('express');
const router = express.Router();

const classificationRoutes = require('./classification/route');
const itemsRoute = require('./item/route');
const fileRoute = require('./file/route');
const pricingRoute = require('./pricing/route');
const saleInvoicedRoute = require('./saleInvoiced/route');

router.use('/classification', classificationRoutes);
router.use('/item', itemsRoute);
router.use('/file', fileRoute);
router.use('/pricing', pricingRoute);
router.use('/saleInvoiced', saleInvoicedRoute);

module.exports = router;
