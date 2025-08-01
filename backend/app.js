require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const suiteqlRoutes = require('./suiteQL/route');
const netsuiteRestRoute = require('./netsuiteRest/route');
const restapiRoutes = require('./restapi/restapi.route');
const bodyParser = require('body-parser');
// const kafkaServicesManager = require('./kafka/services.manager');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json());

// API Routes
app.use('/api/suiteql', suiteqlRoutes);
app.use('/api/netsuite-rest', netsuiteRestRoute);
app.use('/api/restapi', restapiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, 'public')));

  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Kafka health check endpoint
// app.get('/kafka/health', (req, res) => {
//   const health = kafkaServicesManager.getServicesHealth();
//   res.json(health);
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌟 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
