const express = require('express');
const router = express.Router();
const controller = require('./file.controller');

router.get('/by-name', controller.getFilesByNameLike);

module.exports = router; 