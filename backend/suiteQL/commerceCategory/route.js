const express = require('express');
const router = express.Router();
const controller = require('./commerceCategory.controller');

router.get('/', controller.getAllCommerceCategories);
router.get('/by-id', controller.getCommerceCategoryById);
router.get('/primary-parent/:id', controller.getPrimaryParentById);

module.exports = router;
