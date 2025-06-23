const express = require('express');
const router = express.Router();

const classificationRoutes = require('./classification/route');

router.use('/classification', classificationRoutes);

module.exports = router;
