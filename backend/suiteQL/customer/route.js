const express = require('express');
const router = express.Router();
const controller = require('./customer.controller');
const checkJwt = require('../../auth/middleware');

router.get('/by-email', checkJwt, controller.getCustomerByEmail);
router.get('/by-stage', controller.getCustomersByStage);

router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Invalid or missing token' });
    }
    next(err);
});

module.exports = router;
