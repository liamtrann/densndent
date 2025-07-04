// restapi.route.js
const express = require('express');
const router = express.Router();
const checkJwt = require('../auth/middleware');
const orderRoutes = require('./order/order.route');

// Protect all /restapi routes with JWT
// router.use(checkJwt);
router.use('/order', orderRoutes);

// Error handler for UnauthorizedError from express-jwt
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Invalid or missing token' });
    }
    next(err);
});

module.exports = router;
