// routes.js
const express = require('express');
const db = require('./db');

const router = express.Router();

// GET /api/slots
router.get('/slots', async (req, res) => {
  try {
    const rows = await db.getAllSlots();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/slots/free
router.get('/slots/free', async (req, res) => {
  try {
    const rows = await db.getFreeSlots();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/slots/reserved
router.get('/slots/reserved', async (req, res) => {
  try {
    const rows = await db.getReservedSlots();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/slots/:id
router.get('/slots/:id', async (req, res) => {
  try {
    const row = await db.getSlot(req.params.id);
    if (!row) return res.status(404).json({ error: 'Slot not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/slots/:id/reserve
router.post('/slots/:id/reserve', async (req, res) => {
  const { user_id, duration } = req.body;

  if (!user_id || !duration)
    return res.status(400).json({ error: 'user_id and duration required' });

  try {
    const slot = await db.getSlot(req.params.id);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });

    if (slot.status !== 'free')
      return res.status(400).json({ error: 'Slot is not free' });

    await db.updateSlotStatus(req.params.id, 'reserved', user_id, duration);

    // Return the updated slot status
    const updatedSlot = await db.getSlot(req.params.id);
    res.json({ message: 'Slot reserved successfully', slot: updatedSlot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
