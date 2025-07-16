const express = require('express');
const router = express.Router();
const controller = require('./commerceCategory.controller');

router.get('/', controller.getAllCommerceCategories);
router.get('/by-id/:id', controller.getCommerceCategoryById);
router.get('/sub-category-by-parent/:id', controller.getSubCategoryByParentById);

module.exports = router;
