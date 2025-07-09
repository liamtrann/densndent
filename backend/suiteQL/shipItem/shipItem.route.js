// backend/suiteQL/shipItem/shipItem.route.js
const express = require('express');
const router = express.Router();
const shipItemController = require('./shipItem.controller');

// Mount all ship item controller routes under this router
router.use('/', shipItemController);

module.exports = router;
