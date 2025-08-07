// restapi.route.js
const express = require('express');
const router = express.Router();
const { checkJwt } = require('../auth/middleware');
const restApiService = require('./restapi.service');

// Import route modules
const orderRoutes = require('./order/route');
const customerRoutes = require('./customer/route');
const versaPayRoutes = require('./versapay/route');

// Protect all /restapi routes with JWT
router.use(checkJwt);

// Error handler for UnauthorizedError from express-jwt
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Invalid or missing token' });
    }
    next(err);
});

// Use route modules
router.use('/salesOrder', orderRoutes);
router.use('/customer', customerRoutes);
router.use('/versapay', versaPayRoutes);

// // GET a record by type and id
// router.get('/:recordType/:id', async (req, res, next) => {
//     try {
//         const { recordType, id } = req.params;
//         const result = await restApiService.getRecord(recordType, id);
//         res.json(result);
//     } catch (err) {
//         next(err);
//     }
// });

// // GET all records of a type (with optional query params)
// router.get('/:recordType', async (req, res, next) => {
//     try {
//         const { recordType } = req.params;
//         const result = await restApiService.searchRecords(recordType, req.query);
//         res.json(result);
//     } catch (err) {
//         next(err);
//     }
// });

// // POST a new record
// router.post('/:recordType', async (req, res, next) => {
//     try {
//         const { recordType } = req.params;
//         const result = await restApiService.postRecord(recordType, req.body);
//         res.json(result);
//     } catch (err) {
//         next(err);
//     }
// });

// // PATCH update a record by type and id
// router.patch('/:recordType/:id', async (req, res, next) => {
//     try {
//         const { recordType, id } = req.params;
//         const result = await restApiService.patchRecord(recordType, id, req.body);
//         res.json(result);
//     } catch (err) {
//         next(err);
//     }
// });

module.exports = router;
