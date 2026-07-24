import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/index.js';

describe('External Mock API Endpoints (Section 5.1)', () => {
  describe('POST /api/v1/external/users', () => {
    it('should register a new user successfully and return HTTP 201 with apiToken', async () => {
      // Arrange
      const payload = {
        username: 'johndoe',
        email: 'johndoe@institution.gob.ec',
        password: 'SecurePassword123!'
      };

      // Act
      const response = await request(app)
        .post('/api/v1/external/users')
        .send(payload);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username', payload.username);
      expect(response.body).toHaveProperty('email', payload.email);
      expect(response.body).toHaveProperty('apiToken');
      expect(typeof response.body.apiToken).toBe('string');
    });

    it('should return HTTP 400 when required fields are missing', async () => {
      // Arrange
      const invalidPayload = {
        username: 'johndoe'
      };

      // Act
      const response = await request(app)
        .post('/api/v1/external/users')
        .send(invalidPayload);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/external/login', () => {
    it('should authenticate user successfully and return HTTP 200 with JWT token', async () => {
      // Arrange
      const credentials = {
        email: 'admin@institution.gob.ec',
        password: 'AdminPassword123!'
      };

      // Act
      const response = await request(app)
        .post('/api/v1/external/login')
        .send(credentials);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', credentials.email);
    });

    it('should return HTTP 401 when invalid credentials are provided', async () => {
      // Arrange
      const invalidCredentials = {
        email: 'admin@institution.gob.ec',
        password: 'WrongPassword'
      };

      // Act
      const response = await request(app)
        .post('/api/v1/external/login')
        .send(invalidCredentials);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return HTTP 400 when credentials are missing', async () => {
      // Arrange
      const incompleteCredentials = {
        email: 'admin@institution.gob.ec'
      };

      // Act
      const response = await request(app)
        .post('/api/v1/external/login')
        .send(incompleteCredentials);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/v1/external/audit', () => {
    it('should record an audit event successfully and return HTTP 201', async () => {
      // Arrange
      const auditPayload = {
        userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        action: 'USER_LOGIN',
        details: { ip: '127.0.0.1', device: 'Chrome' }
      };

      // Act
      const response = await request(app)
        .post('/api/v1/external/audit')
        .send(auditPayload);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('action', auditPayload.action);
      expect(response.body).toHaveProperty('status', 'recorded');
    });

    it('should return HTTP 400 when action parameter is missing', async () => {
      // Arrange
      const invalidAuditPayload = {
        userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
        // action missing
      };

      // Act
      const response = await request(app)
        .post('/api/v1/external/audit')
        .send(invalidAuditPayload);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
