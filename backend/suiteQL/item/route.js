const express = require('express');
const router = express.Router();
const controller = require('./item.controller');
const checkJwt = require('../../auth/middleware');

router.get('/by-class', controller.getItemsByClass);

router.get('/by-id', controller.getItemById);
router.post('/by-parent', controller.postGetItemsByParent);

// router.get('/by-id-with-base-price', controller.getItemByIdWithBasePrice);

router.post('/by-ids', controller.postItemsByIds);

router.post('/search-by-name-like', controller.postItemsByNameLike);

router.get('/count-by-class', controller.getCountByClass);
router.post('/count-by-name', controller.getCountByName);

router.get('/by-brand', controller.getItemsByBrand);

router.get('/count-by-brand', controller.getCountByBrand);

router.get('/by-class-and-brand', controller.getItemsByClassAndBrand);

router.get('/by-category', controller.getItemsByCategory);

router.get('/by-user-order-history', checkJwt, controller.getItemsByUserOrderHistory);

module.exports = router;