// routes.js
const express = require('express');
const db = require('./db');

const router = express.Router();

// GET /api/slots
router.get('/slots', async (req, res) => {
  try {
    console.log('Fetching all slots');
    const rows = await db.getAllSlots();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching all slots:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/slots/free
router.get('/slots/free', async (req, res) => {
  try {
    console.log('Fetching free slots');
    const rows = await db.getFreeSlots();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching free slots:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/slots/reserved
router.get('/slots/reserved', async (req, res) => {
  try {
    console.log('Fetching reserved slots');
    const rows = await db.getReservedSlots();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching reserved slots:', err);
    res.status(500).json({ error: err.message });
  }
});

// get histhory of all slots
router.get('/slots/history', async (req, res) => {
  try {
    console.log('Fetching slot history');
    const rows = await db.getAllSlotHistory();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching slot history:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/slots/:id
router.get('/slots/:id', async (req, res) => {
  try {
    console.log(`Fetching slot with ID: ${req.params.id}`);
    const row = await db.getSlot(req.params.id);
    if (!row) return res.status(404).json({ error: 'Slot not found' });
    res.json(row);
  } catch (err) {
    console.error(`Error fetching slot ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/slots/:id/reserve
router.post('/slots/:id/reserve', async (req, res) => {
  console.log(`Reserving slot with ID: ${req.params.id}`);
  const { user_id, duration } = req.body;

  if (!user_id || !duration){
    console.error('user_id and duration are required to reserve a slot');
    return res.status(400).json({ error: 'user_id and duration required' });
  }
  try {
    const slot = await db.getSlot(req.params.id);
    console.log('Slot fetched for reservation:', slot);

    if (!slot) {
      console.error(`Slot with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Slot not found' });
    }
    if (slot.status !== 'free'){
      console.error(`Slot with ID ${req.params.id} is not free`);
      return res.status(400).json({ error: 'Slot is not free' });
    }
    await db.updateSlotStatus(req.params.id, 'reserved', user_id, duration);

    // Return the updated slot status
    const updatedSlot = await db.getSlot(req.params.id);
    res.json({ message: 'Slot reserved successfully', slot: updatedSlot });
  } catch (err) {
    console.error(`Error reserving slot ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to cancel reservation
router.post('/slots/:id/cancel', async (req, res) => {
  try {
    console.log(`Cancelling reservation for slot ID: ${req.params.id}`);
    const slot = await db.getSlot(req.params.id);
    if (!slot) {
      console.error(`Slot with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Slot not found' });
    }
    if (slot.status !== 'reserved'){
      console.error(`Slot with ID ${req.params.id} is not reserved`);
      return res.status(400).json({ error: 'Slot is not reserved' });
    }
    await db.updateSlotStatus(req.params.id, 'free');

    // Return the updated slot status
    const updatedSlot = await db.getSlot(req.params.id);
    res.json({ message: 'Reservation cancelled successfully', slot: updatedSlot });
  } catch (err) {
    console.error(`Error cancelling reservation for slot ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
