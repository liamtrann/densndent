const express = require('express');
const router = express.Router();
const PromotionController = require('./promotion.controller');

// GET /suiteql/promotion
router.get('/', PromotionController.getActivePublic);

router.get('/by-product', PromotionController.getPromotionsByProductId);

module.exports = router;
