const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const customerService = require('../suiteQL/customer/customer.service');
require('dotenv').config();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// Reusable function for user authentication and validation
const validateUserAccess = async (req, requestedUserId) => {
  // Get Auth0 user info from the JWT token (req.auth is set by checkJwt middleware)
  const userEmail = req.auth?.['https://densdente.com/email'];

  if (!userEmail) {
    return { error: 'User authentication required', status: 401 };
  }

  if (!requestedUserId) {
    return { error: 'userId is required', status: 400 };
  }

  // Find user in your system by email to get their database user ID
  const customers = await customerService.findByEmail(userEmail, 1, 0);
  const customer = customers?.[0];

  if (!customer) {
    return { error: 'User not found in system', status: 404 };
  }

  // Check if the requested userId matches the authenticated user's database ID
  if (String(requestedUserId) !== String(customer.id)) {
    return { error: 'Forbidden: You can only access your own data', status: 403 };
  }

  return { customer, valid: true };
};

// Middleware wrapper for validateUserAccess
const validateUserAccessMiddleware = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const validation = await validateUserAccess(req, userId);

    if (!validation.valid) {
      return res.status(validation.status).json({ error: validation.error });
    }

    // Add validated customer to request object for use in controller
    req.validatedCustomer = validation.customer;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error during user validation' });
  }
};

module.exports = { checkJwt, validateUserAccess, validateUserAccessMiddleware };
