require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const suiteqlRoutes = require('./suiteQL/route');
const protectedRoutes = require('./protected/route');
const netsuiteRestRoute = require('./netsuiteRest/route');
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/suiteql', suiteqlRoutes);
app.use('/protected', protectedRoutes);
app.use('/netsuite-rest', netsuiteRestRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});