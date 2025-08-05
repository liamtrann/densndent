const restApiService = require('../restapi.service');

// Create a new customer
const createCustomer = async (req, res, next) => {
    try {
        const result = await restApiService.postRecord('customer', req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

// Get a specific customer by ID
const getCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await restApiService.getRecord('customer', id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// Update a customer by ID
const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await restApiService.patchRecord('customer', id, req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createCustomer,
    getCustomer,
    updateCustomer
};
