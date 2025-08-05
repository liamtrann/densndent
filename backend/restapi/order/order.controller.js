// order.controller.js
// Controller for order endpoints

const restApiService = require('../restapi.service');

// Create a new sales order
const createSalesOrder = async (req, res, next) => {
    try {
        const result = await restApiService.postRecord('salesOrder', req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

// Get a specific sales order by ID
const getSalesOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await restApiService.getRecord('salesOrder', id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// Update sales order
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await restApiService.patchRecord('salesOrder', id, req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createSalesOrder,
    getSalesOrder,
    updateOrderStatus
};
