const app = require('./server');
const startMqttSubscriber = require('./mqttClient');

if (process.env.NODE_ENV !== 'test') {
  startMqttSubscriber();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT}`)
);
