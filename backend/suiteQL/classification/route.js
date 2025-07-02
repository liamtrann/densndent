const express = require('express');
const router = express.Router();
const controller = require('./classification.controller');

router.get('/', controller.getAllClassifications);
router.get('/by-parent-class', controller.getAllParentClass);
router.get('/sub-child-class', controller.getAllChildClass);
router.post('/by-ids', controller.postClassificationsByIds);

module.exports = router;