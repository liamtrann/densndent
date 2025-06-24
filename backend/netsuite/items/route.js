const express = require('express');
const router = express.Router();
const controller = require('./items.controller');

router.get('/by-class', controller.getItemsByClass);

module.exports = router; 