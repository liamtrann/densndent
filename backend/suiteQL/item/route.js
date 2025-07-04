const express = require('express');
const router = express.Router();
const controller = require('./item.controller');

router.get('/by-class', controller.getItemsByClass);

router.get('/by-id', controller.getItemById);

router.get('/by-id-with-base-price', controller.getItemByIdWithBasePrice);

router.post('/by-ids', controller.postItemsByIds);

router.get('/by-name', controller.getItemsByNameLike);

router.post('/by-name', controller.postItemsByNameLike);

router.get('/count-by-class', controller.getCountByClass);

router.get('/by-brand', controller.getItemsByBrand);

router.get('/count-by-brand', controller.getCountByBrand);

module.exports = router;