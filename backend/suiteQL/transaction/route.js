const express = require('express');
const router = express.Router();
const controller = require('./transaction.controller');
const { checkJwt, validateUserAccessMiddleware } = require('../../auth/middleware');

// Apply authentication middleware to all routes
router.use(checkJwt, validateUserAccessMiddleware);

router.get('/by-id', controller.getTransactionById);
router.get('/by-email', controller.getTransactionByEmail);
router.get('/by-user-order-history', controller.getItemsByUserOrderHistory);
router.get('/order-details-by-transaction', controller.getOrderDetailsByTransaction);

module.exports = router;
