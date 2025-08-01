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

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
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

// Config check endpoint
app.get('/api/config-check', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3001,
    hasNetSuiteConfig: !!(process.env.SUITEQL_CONSUMER_KEY && process.env.SUITEQL_CONSUMER_SECRET),
    frontendUrl: process.env.FRONTEND_URL,
    envVars: {
      NODE_ENV: process.env.NODE_ENV,
      SUITEQL_CONSUMER_KEY: process.env.SUITEQL_CONSUMER_KEY ? '***set***' : 'missing',
      SUITEQL_CONSUMER_SECRET: process.env.SUITEQL_CONSUMER_SECRET ? '***set***' : 'missing',
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN ? '***set***' : 'missing',
      NETSUITE_BASE_URL: process.env.NETSUITE_BASE_URL ? '***set***' : 'missing'
    },
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

// Kafka health check endpoint
// app.get('/kafka/health', (req, res) => {
//   const health = kafkaServicesManager.getServicesHealth();
//   res.json(health);
// });

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
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
