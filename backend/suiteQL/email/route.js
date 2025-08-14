const express = require('express');
const router = express.Router();
const controller = require('./email.controller');

router.post('/send', controller.sendEmail);
router.post('/send-html', controller.sendHtmlEmail);
router.post('/send-order-confirmation', controller.sendOrderConfirmation);

module.exports = router;
