const express = require('express');
const router = express.Router();
const controller = require('./item.controller');

router.get('/by-class', controller.getItemsByClass);

router.get('/by-id', controller.getItemById);

module.exports = router; 