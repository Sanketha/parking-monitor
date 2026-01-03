// db.js
const { DateTime } = require('luxon');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
});

// Get slot by ID (with status)
async function getSlot(slotId) {
  console.log(`DB: getSlot called for slotId: ${slotId}`);
  const res = await pool.query(
    `SELECT ps.slot_id, ps.lat, ps.lng, ps.is_active,
            ss.status, ss.updated_at, ss.user_id, ss.duration
     FROM parking_slots ps
     LEFT JOIN slot_status ss ON ps.slot_id = ss.slot_id
     WHERE ps.slot_id = $1`,
    [slotId]
  );
  return res.rows[0];
}

// Insert new slot
async function insertSlot(slotId, lat, lng, isActive = true) {
  await pool.query(
    `INSERT INTO parking_slots(slot_id, lat, lng, is_active)
     VALUES($1, $2, $3, $4)
     ON CONFLICT (slot_id) DO NOTHING`,
    [slotId, lat, lng, isActive]
  );
}

// Get all slots with their status
async function getAllSlots() {
  console.log('DB: getAllSlots called');
  const result = await pool.query(
    `SELECT ps.slot_id, ps.lat, ps.lng, ps.is_active,
            ss.status, ss.updated_at
     FROM parking_slots ps
     LEFT JOIN slot_status ss ON ps.slot_id = ss.slot_id`
  );
  console.log('DB: getAllSlots result:', result.rows);
  return result.rows;
}

// Get all free slots
async function getFreeSlots() {
  console.log('DB: getFreeSlots called');
  const result = await pool.query(
    `SELECT ps.slot_id, ps.lat, ps.lng
     FROM parking_slots ps
     JOIN slot_status ss ON ps.slot_id = ss.slot_id
     WHERE ss.status = 'free'`
  );
  console.log('DB: getFreeSlots result:', result.rows);
  return result.rows;
}

function isReservationActive(updatedAt, duration) {
 if (!updatedAt || !duration || duration <= 0) return false;

  // Convert updatedAt to Luxon DateTime
  const updated = DateTime.fromJSDate(updatedAt).setZone('Europe/Stockholm');

  if (!updated.isValid) {
    console.log('Invalid updatedAt:', updatedAt);
    return false;
  }

  const expiry = updated.plus({ minutes: duration });
  const now = DateTime.now().setZone('Europe/Stockholm');

  console.log('Updated at :', updated.toISO());
  console.log('Expiry:', expiry.toISO());
  console.log('Current time:', now.toISO());
  console.log('Is reservation active?', now < expiry);

  return now < expiry;
}

// Update slot status
async function updateSlotStatus(slotId, newStatus, userId = null, duration = null) {
  await pool.query(
    `INSERT INTO slot_status(slot_id, status, updated_at, user_id, duration)
     VALUES ($1, $2, (NOW() AT TIME ZONE 'Europe/Stockholm'), $3, $4)
     ON CONFLICT (slot_id)
     DO UPDATE SET status = EXCLUDED.status,
                   updated_at = (NOW() AT TIME ZONE 'Europe/Stockholm'),
                   user_id = EXCLUDED.user_id,
                   duration = EXCLUDED.duration`,
    [slotId, newStatus, userId, duration]
  );

  await pool.query(
    `INSERT INTO status_history(slot_id, status, timestamp)
     VALUES ($1, $2, NOW())`,
    [slotId, newStatus]
  );
}

// Get current slot status
async function getSlotStatus(slotId) {
  const res = await pool.query(
    `SELECT * FROM slot_status WHERE slot_id = $1`,
    [slotId]
  );
  return res.rows[0];
}

// Get all reserved slots
async function getReservedSlots() {
  console.log('DB: getReservedSlots called');
  const result = await pool.query(
    `SELECT ps.slot_id, ps.lat, ps.lng, ss.user_id, ss.duration, ss.updated_at
     FROM parking_slots ps
     JOIN slot_status ss ON ps.slot_id = ss.slot_id
     WHERE ss.status = 'reserved'`
  );
  console.log('DB: getReservedSlots result:', result.rows);
  return result.rows;
}

//getAllSlotHistory
async function getAllSlotHistory() {
  console.log('DB: getAllSlotHistory called');
  const result = await pool.query(
    `SELECT * FROM status_history ORDER BY timestamp DESC`
  );
  console.log('DB: getAllSlotHistory result:', result.rows);
  return result.rows;
}

module.exports = {
  pool,
  getSlot,
  insertSlot,
  getAllSlots,
  getFreeSlots,
  updateSlotStatus,
  getSlotStatus,
  isReservationActive,
  getReservedSlots,
  getAllSlotHistory
};
