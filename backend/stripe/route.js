const express = require("express");
const router = express.Router();
const stripeController = require("./stripe.controller");
const { checkJwt } = require("../auth/middleware");

// Apply checkJwt middleware to all routes
router.use(checkJwt);

// Create Stripe customer for existing customer
router.post("/customer/create-stripe", stripeController.createStripeCustomer);

// Get customer information
router.get("/customer/:customerId", stripeController.getCustomer);

// Get customer by email
router.get("/customer/email/:email", stripeController.getCustomerByEmail);

// Update customer information
router.put("/customer/:customerId", stripeController.updateCustomer);

// Payment method routes
router.post(
  "/customer/:customerId/payment-methods/attach",
  stripeController.attachPaymentMethod
);
router.get(
  "/customer/:customerId/payment-methods",
  stripeController.listPaymentMethods
);
router.delete(
  "/payment-methods/:paymentMethodId",
  stripeController.detachPaymentMethod
);

// Payment routes
router.post("/payment/create", stripeController.createPayment);
router.post("/payment/confirm", stripeController.confirmPayment);

module.exports = router;
