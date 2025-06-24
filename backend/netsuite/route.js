const express = require('express');
const router = express.Router();

const classificationRoutes = require('./classification/route');
const itemsRoute = require('./items/route');

router.use('/classification', classificationRoutes);
router.use('/items', itemsRoute);

module.exports = router;
