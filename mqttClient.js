// mqttClient.js
const mqtt = require('mqtt');
const db = require('./db');
require('dotenv').config();

function startMqttSubscriber() {
  const client = mqtt.connect(process.env.HIVEMQ_URL);

  client.on('connect', () => {
    console.log('MQTT connected');
    client.subscribe('parking/slot/+/status', (err) => {
      if (err) console.error('MQTT subscribe error:', err);
      else console.log('Subscribed to parking/slot/+/status');
    });
  });

  client.on('message', async (topic, message) => {
    try {
      const slotId = topic.split('/')[2];
      const payload = JSON.parse(message.toString());
      const newStatus = payload.occupied ? "occupied" : "free";

      console.log(`MQTT update → Slot ${slotId}, Status: ${newStatus}`);

      const existing = await db.getSlot(slotId);

      if (!existing) {
        await db.insertSlot(slotId, newStatus);
        console.log(`Inserted slot ${slotId}`);
      } else if (existing.status !== newStatus) {
        const isreservationActive = db.isReservationActive(existing.updated_at, existing.duration);
        console.log('Is reservation active for slot', slotId, ':', isreservationActive);
        if (existing.status === 'reserved' && isreservationActive) {
            console.log(`Slot ${slotId} reserved, ignoring MQTT update`);
            return;
        }
        console.log(`Slot ${slotId} status change: ${existing.status} → ${newStatus}`);
        await db.updateSlotStatus(slotId, newStatus);
      }

    } catch (err) {
      console.error('MQTT message error:', err);
    }
  });

  return client;
}

module.exports = startMqttSubscriber;
