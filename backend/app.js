require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const suiteqlRoutes = require('./suiteQL/route');
const netsuiteRestRoute = require('./netsuiteRest/route');
const restapiRoutes = require('./restapi/restapi.route');
const versapayRoutes = require('./versapay/route');
const bodyParser = require('body-parser');
const cronManager = require('./cron');

// Initialize Bull Queue and Worker
// In development: run everything in one process
// In production: separate web and worker processes using WORKER_MODE env variable
if (process.env.NODE_ENV !== 'production' || process.env.WORKER_MODE !== 'false') {
  console.log('🔧 [APP] Initializing Bull Queue and Worker...');
  const { recurringOrderQueue } = require('./queue/orderQueue');
  console.log('✅ [APP] Bull Queue worker initialized and ready to process jobs');
  console.log('🎯 [APP] Worker is listening for recurring order jobs...');
} else {
  console.log('🌐 [APP] Running in web-only mode (worker disabled)');
}

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
app.use('/api/versapay', versapayRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    workerEnabled: process.env.NODE_ENV !== 'production' || process.env.WORKER_MODE !== 'false'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Cron jobs status endpoint
app.get('/api/cron/status', (req, res) => {
  res.json({
    status: 'active',
    jobs: cronManager.getJobsStatus(),
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  const frontendPath = path.join(__dirname, '..', 'frontend', 'build');

  console.log('🔍 Attempting to serve static files from:', frontendPath);

  // Check if build directory exists
  if (fs.existsSync(frontendPath)) {
    console.log('✅ Frontend build directory found');
    app.use(express.static(frontendPath));

    // Catch all handler: send back React's index.html file for any non-API routes
    app.get('*', (req, res) => {
      const indexPath = path.join(frontendPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({
          error: 'Frontend index.html not found',
          path: indexPath
        });
      }
    });
  } else {
    console.log('❌ Frontend build directory not found:', frontendPath);
    // Fallback: serve a simple message for non-API routes
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
        return; // Let other routes handle API calls
      }
      res.json({
        message: 'Frontend not built yet. This is the backend API.',
        availableEndpoints: ['/health', '/api/test', '/api/config-check'],
        buildPath: frontendPath,
        exists: false
      });
    });
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌟 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Initialize cron jobs
  cronManager.initializeCronJobs();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  cronManager.stopAllJobs(); // Stop cron jobs
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
