const express = require('express');
const router = express.Router();
const controller = require('./transaction.controller');

router.get('/by-id', controller.getTransactionById);

module.exports = router;
