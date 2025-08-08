const express = require('express');
const router = express.Router();
const controller = require('./email.controller');

router.post('/send', controller.sendEmail);

module.exports = router;
