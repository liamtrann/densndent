require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const suiteqlRoutes = require('./suiteQL/route');
const netsuiteRestRoute = require('./netsuiteRest/route');
const restapiRoutes = require('./restapi/restapi.route');
const bodyParser = require('body-parser');
const kafkaServicesManager = require('./kafka/services.manager');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/suiteql', suiteqlRoutes);
app.use('/netsuite-rest', netsuiteRestRoute);
app.use('/restapi', restapiRoutes);

// Kafka health check endpoint
app.get('/kafka/health', (req, res) => {
  const health = kafkaServicesManager.getServicesHealth();
  res.json(health);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

// Start server and Kafka services
async function startServer() {
  try {
    // Start Kafka microservices
    await kafkaServicesManager.startAllServices();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🌟 Server running on port ${PORT}`);
      console.log(`🔍 Kafka health check: http://localhost:${PORT}/kafka/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();