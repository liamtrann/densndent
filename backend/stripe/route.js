const express = require("express");
const router = express.Router();
const stripeController = require("./stripe.controller");

// Create Stripe customer for existing customer
router.post("/customer/create-stripe", stripeController.createStripeCustomer);

// Get customer information
router.get("/customer/:customerId", stripeController.getCustomer);

// Update customer information
router.put("/customer/:customerId", stripeController.updateCustomer);

module.exports = router;
