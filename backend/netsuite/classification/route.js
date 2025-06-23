const express = require('express');
const router = express.Router();
const controller = require('./classification.controller');

router.get('/', controller.getAllClassifications);

module.exports = router;