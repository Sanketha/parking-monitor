const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const routes = require('./routes');
// const startMqttSubscriber = require('./mqttClient');

const app = express();
app.set('trust proxy', true);
app.use(bodyParser.json());

// REST API routes
app.use('/api', routes);

// simple health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;

// Start MQTT subscriber in background
// startMqttSubscriber();

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
