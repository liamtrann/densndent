const express = require('express');
const router = express.Router();
const controller = require('./classification.controller');

router.get('/', controller.getAllClassifications);
router.get('/by-class', controller.getAllParentClass);
router.get('/sub-class', controller.getAllChildClass);

module.exports = router;