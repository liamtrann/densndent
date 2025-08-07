// backend/restapi/versapay/route.js
const express = require('express');
const router = express.Router();
const versaPayController = require('./versapay.controller');
const auth = require('../../auth/middleware');

// VersaPay routes
router.post('/session', versaPayController.createSession);     // POST /versapay/session
router.post('/wallet', versaPayController.createWallet);       // POST /versapay/wallet
router.post('/payment', versaPayController.processPayment);    // POST /versapay/payment
router.post('/finalize', versaPayController.finalizeOrder);    // POST /versapay/finalize

module.exports = router;
