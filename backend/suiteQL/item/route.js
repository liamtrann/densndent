const express = require('express');
const router = express.Router();
const controller = require('./item.controller');

router.get('/by-class', controller.getItemsByClass);

router.get('/by-id', controller.getItemById);

router.get('/by-id-with-base-price', controller.getItemByIdWithBasePrice);

router.post('/by-ids', controller.postItemsByIds);

router.get('/by-name', controller.getItemsByNameLike);

router.post('/by-name', controller.postItemsByNameLike);

module.exports = router;