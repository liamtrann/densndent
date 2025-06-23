require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const classificationRoutes = require('./netsuite/classification/route');
const checkJwt = require('./auth.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/netsuite/classification', classificationRoutes);

app.get('/protected', checkJwt, (req, res) => {
  res.send(`Hello, ${req.auth.sub}. You accessed a protected route!`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});