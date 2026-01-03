const request = require('supertest');
const app = require('../server');
const db = require('../db');

jest.mock('../db');

describe('Local API tests', () => {

    test('Health check works', async () => {
        const res = await request(app).get('/health');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });

    test('GET /api/slots returns 200', async () => {
        const res = await request(app).get('/api/slots');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/slots/free returns 200', async () => {
        const res = await request(app).get('/api/slots/free');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/slots/reserved returns 200', async () => {
        const res = await request(app).get('/api/slots/reserved');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /api/slots/:id returns 200', async () => {
        const res = await request(app).get('/api/slots/1');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('slot_id');
    });

    test('POST /api/slots/:id/reserve returns 200', async () => {
        const res = await request(app)
            .post('/api/slots/1/reserve')
            .send({ user_id: 123, duration: 60 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Slot reserved successfully');
        expect(res.body).toHaveProperty('slot');
    });

    test('GET /api/slots/history returns 200', async () => {
        const res = await request(app).get('/api/slots/history');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/slots/:id/cancel returns 200 when slot is reserved', async () => {
        const res = await request(app)
            .post('/api/slots/2/cancel');

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Reservation cancelled successfully');
        expect(res.body.slot).toBeDefined();

        // Verify DB calls
        expect(db.getSlot).toHaveBeenCalledWith('2');
        expect(db.updateSlotStatus).toHaveBeenCalledWith('2', 'free');
    });


});
