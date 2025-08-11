// recurringOrder.controller.js
// Controller for recurring order endpoints

const restApiService = require('../restapi.service');

// Create a new recurring order
const createRecurringOrder = async (req, res, next) => {
    try {
        const result = await restApiService.postRecord('customrecord_recurring_order', req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

// Get a specific recurring order by ID
const getRecurringOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await restApiService.getRecord('customrecord_recurring_order', id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// Update recurring order
const updateRecurringOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await restApiService.patchRecord('customrecord_recurring_order', id, req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// Search recurring orders
const searchRecurringOrders = async (req, res, next) => {
    try {
        const result = await restApiService.searchRecords('customrecord_recurring_order', req.query);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createRecurringOrder,
    getRecurringOrder,
    updateRecurringOrder,
    searchRecurringOrders
};
