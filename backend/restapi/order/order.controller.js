// order.controller.js
// Controller for order endpoints

const orderService = require('./order.service');

module.exports = {
    async createOrder(req, res, next) {
        try {
            const order = await orderService.createOrder(req.body);
            res.status(201).json(order);
        } catch (err) {
            next(err);
        }
    },

    async getOrderById(req, res, next) {
        try {
            const order = await orderService.getOrderById(req.params.id);
            res.json(order);
        } catch (err) {
            next(err);
        }
    },

    async listOrders(req, res, next) {
        try {
            const orders = await orderService.listOrders();
            res.json(orders);
        } catch (err) {
            next(err);
        }
    },
};
