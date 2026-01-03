module.exports = {
  getAllSlots: jest.fn().mockResolvedValue([
    { slot_id: 1, lat: 59.3, lng: 18.0, status: 'free' },
    { slot_id: 2, lat: 59.31, lng: 18.01, status: 'reserved' },
  ]),

  getFreeSlots: jest.fn().mockResolvedValue([
    { slot_id: 1, lat: 59.3, lng: 18.0, status: 'free' }
  ]),

  getReservedSlots: jest.fn().mockResolvedValue([
    { slot_id: 2, lat: 59.31, lng: 18.01, status: 'reserved' }
  ]),

  getSlot: jest.fn().mockImplementation(async (id) => {
    if (id == 1) return { slot_id: 1, status: 'free' };
    if (id == 2) return { slot_id: 2, status: 'reserved' };
    return null;
  }),

  getAllSlotHistory: jest.fn().mockResolvedValue([
    { id: 1, slot_id: 1, status: 'free', timestamp: '2024-01-01T10:00:00Z' },
    { id: 2, slot_id: 2, status: 'reserved', timestamp: '2024-01-01T11:00:00Z' }
  ]),

  updateSlotStatus: jest.fn().mockResolvedValue(true),

  insertSlot: jest.fn().mockResolvedValue(true),
  getSlotStatus: jest.fn().mockResolvedValue({ slot_id: 1, status: 'free' }),
  isReservationActive: jest.fn().mockReturnValue(false),
};
