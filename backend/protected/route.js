const express = require('express');
const router = express.Router();
const checkJwt = require('../auth/middleware');

router.get('/', checkJwt, (req, res) => {
  res.send(`Hello, ${req.auth.sub}. You accessed a protected route!`);
});

module.exports = router;
