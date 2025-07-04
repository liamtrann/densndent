const express = require('express');
const router = express.Router();
const PromotionController = require('./promotion.controller');

// GET /suiteql/promotion
router.get('/', PromotionController.getActivePublic);

module.exports = router;
