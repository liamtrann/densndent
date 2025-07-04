const express = require('express');
const router = express.Router();
const controller = require('./transaction.controller');
const checkJwt = require('../../auth/middleware');

// router.use(checkJwt);
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Invalid or missing token' });
    }
    next(err);
});

router.get('/by-id', controller.getTransactionById);
router.get('/by-email', controller.getTransactionByEmail);

module.exports = router;
