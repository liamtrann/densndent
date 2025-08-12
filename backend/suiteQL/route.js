const express = require('express');
const router = express.Router();

const classificationRoutes = require('./classification/route');
const itemsRoute = require('./item/route');
const fileRoute = require('./file/route');
const pricingRoute = require('./pricing/route');
const saleInvoicedRoute = require('./saleInvoiced/route');
const customerRoute = require('./customer/route');
const brandsRoute = require('./brands/route');
const emailRoute = require('./email/route');
const transactionRoute = require('./transaction/route');
const promotionRoute = require('./promotion/route');
const shipItemRoute = require('./shipItem/route');
const inventoryRoute = require('./inventory/route');
const commerceCategoryRoute = require('./commerceCategory/route');
const taxRoute = require('./tax/route');
const recurringOrderRoute = require('./recurringOrder/route');
const { checkJwt } = require('../auth/middleware');

router.use('/classification', classificationRoutes);
router.use('/item', itemsRoute);
router.use('/file', fileRoute);
router.use('/pricing', pricingRoute);
router.use('/saleInvoiced', saleInvoicedRoute);
router.use('/customer', checkJwt, customerRoute);
router.use('/brands', brandsRoute);
router.use('/transaction', transactionRoute);
router.use('/promotion', promotionRoute);
router.use('/shipItem', shipItemRoute);
router.use('/inventory', inventoryRoute);
router.use('/commerceCategory', commerceCategoryRoute);
router.use('/tax', taxRoute);
router.use('/email', emailRoute);

router.use('/recurring-order', recurringOrderRoute);

router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Invalid or missing token' });
    }
    next(err);
});

module.exports = router;
