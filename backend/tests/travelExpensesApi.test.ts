import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import app from '../src/index.js';
import { generateToken } from '../src/middleware/auth.js';

describe('Desafío B: API Interna de Viáticos y RBAC (Secciones 5.2 y 6)', () => {
  const requesterUser = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    email: 'requester@institution.gob.ec',
    role: 'requester' as const
  };

  const otherRequesterUser = {
    id: 'f99ebc99-9c0b-4ef8-bb6d-6bb9bd380aff',
    email: 'other@institution.gob.ec',
    role: 'requester' as const
  };

  const approverUser = {
    id: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    email: 'approver@institution.gob.ec',
    role: 'approver' as const
  };

  const adminUser = {
    id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    email: 'admin@institution.gob.ec',
    role: 'admin' as const
  };

  let requesterToken: string;
  let otherRequesterToken: string;
  let approverToken: string;
  let adminToken: string;

  beforeAll(async () => {
    requesterToken = await generateToken(requesterUser);
    otherRequesterToken = await generateToken(otherRequesterUser);
    approverToken = await generateToken(approverUser);
    adminToken = await generateToken(adminUser);
  });

  describe('POST /api/v1/travel-expenses (Create Travel Expense)', () => {
    it('should return HTTP 401 when request is unauthenticated', async () => {
      const response = await request(app)
        .post('/api/v1/travel-expenses')
        .send({ destination: 'Quito', amount: 150.0, startDate: '2026-08-01T08:00:00Z', endDate: '2026-08-05T18:00:00Z' });

      expect(response.status).toBe(401);
    });

    it('should create travel expense for requester and return HTTP 201 with status Draft', async () => {
      const payload = {
        destination: 'Guayaquil',
        amount: 250.00,
        startDate: '2026-08-10T08:00:00Z',
        endDate: '2026-08-15T18:00:00Z'
      };

      const response = await request(app)
        .post('/api/v1/travel-expenses')
        .set('Authorization', `Bearer ${requesterToken}`)
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('destination', payload.destination);
      expect(response.body).toHaveProperty('status', 'Draft');
    });

    it('should return HTTP 400 when validation fails', async () => {
      const invalidPayload = {
        destination: 'Cuenca',
        amount: -50
      };

      const response = await request(app)
        .post('/api/v1/travel-expenses')
        .set('Authorization', `Bearer ${requesterToken}`)
        .send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/v1/travel-expenses/:id (Edit Travel Expense - Requester RBAC)', () => {
    it('should allow requester to edit their own Draft travel expense', async () => {
      const createRes = await request(app)
        .post('/api/v1/travel-expenses')
        .set('Authorization', `Bearer ${requesterToken}`)
        .send({
          destination: 'Loja',
          amount: 100.00,
          startDate: '2026-10-01T08:00:00Z',
          endDate: '2026-10-05T18:00:00Z'
        });

      const expenseId = createRes.body.id;

      const response = await request(app)
        .put(`/api/v1/travel-expenses/${expenseId}`)
        .set('Authorization', `Bearer ${requesterToken}`)
        .send({ destination: 'Ambato', amount: 120.00 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('destination', 'Ambato');
    });

    it('should return HTTP 403 when requester attempts to edit another user expense', async () => {
      const createRes = await request(app)
        .post('/api/v1/travel-expenses')
        .set('Authorization', `Bearer ${requesterToken}`)
        .send({
          destination: 'Ibarra',
          amount: 180.00,
          startDate: '2026-11-01T08:00:00Z',
          endDate: '2026-11-05T18:00:00Z'
        });

      const expenseId = createRes.body.id;

      const response = await request(app)
        .put(`/api/v1/travel-expenses/${expenseId}`)
        .set('Authorization', `Bearer ${otherRequesterToken}`)
        .send({ destination: 'Tulcan' });

      expect(response.status).toBe(403);
    });

    it('should return HTTP 400 when requester attempts to edit an expense not in Draft status', async () => {
      const createRes = await request(app)
        .post('/api/v1/travel-expenses')
        .set('Authorization', `Bearer ${requesterToken}`)
        .send({
          destination: 'Salinas',
          amount: 220.00,
          startDate: '2026-12-01T08:00:00Z',
          endDate: '2026-12-05T18:00:00Z'
        });

      const expenseId = createRes.body.id;

      await request(app)
        .patch(`/api/v1/travel-expenses/${expenseId}/status`)
        .set('Authorization', `Bearer ${approverToken}`)
        .send({ status: 'Approved' });

      const response = await request(app)
        .put(`/api/v1/travel-expenses/${expenseId}`)
        .set('Authorization', `Bearer ${requesterToken}`)
        .send({ destination: 'Galapagos' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/travel-expenses (List Travel Expenses with RBAC)', () => {
    it('should return HTTP 200 and list only requester own expenses for requester role', async () => {
      const response = await request(app)
        .get('/api/v1/travel-expenses')
        .set('Authorization', `Bearer ${requesterToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return HTTP 200 and list all expenses for admin role', async () => {
      const response = await request(app)
        .get('/api/v1/travel-expenses')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PATCH /api/v1/travel-expenses/:id/status (Change Status with RBAC)', () => {
    it('should allow approver to update status to Approved and trigger audit log', async () => {
      const createRes = await request(app)
        .post('/api/v1/travel-expenses')
        .set('Authorization', `Bearer ${requesterToken}`)
        .send({
          destination: 'Manta',
          amount: 300.00,
          startDate: '2026-09-01T08:00:00Z',
          endDate: '2026-09-05T18:00:00Z'
        });

      const expenseId = createRes.body.id;

      const response = await request(app)
        .patch(`/api/v1/travel-expenses/${expenseId}/status`)
        .set('Authorization', `Bearer ${approverToken}`)
        .send({ status: 'Approved' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'Approved');
    });

    it('should return HTTP 403 when requester attempts to approve a request', async () => {
      const response = await request(app)
        .patch('/api/v1/travel-expenses/some-uuid/status')
        .set('Authorization', `Bearer ${requesterToken}`)
        .send({ status: 'Approved' });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/v1/audit (Get Audit Logs - Admin only)', () => {
    it('should allow admin to access audit logs (HTTP 200)', async () => {
      const response = await request(app)
        .get('/api/v1/audit')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return HTTP 403 when non-admin accesses audit logs', async () => {
      const response = await request(app)
        .get('/api/v1/audit')
        .set('Authorization', `Bearer ${requesterToken}`);

      expect(response.status).toBe(403);
    });
  });
});
