const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const routes = require('./routes');
const startMqttSubscriber = require('./mqttClient');

const app = express();
app.use(bodyParser.json());

// REST API routes
app.use('/api', routes);

// Start MQTT subscriber in background
startMqttSubscriber();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
