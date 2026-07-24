import type { Request, Response } from 'express';
import crypto from 'node:crypto';

export const registerExternalUser = (req: Request, res: Response): void => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: 'Missing required fields: username, email, and password are required' });
    return;
  }

  const mockUser = {
    id: crypto.randomUUID(),
    username,
    email,
    apiToken: `mock_api_token_${crypto.randomBytes(16).toString('hex')}`,
    createdAt: new Date().toISOString()
  };

  res.status(201).json(mockUser);
};

export const externalLogin = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Missing required fields: email and password are required' });
    return;
  }

  // Simulated valid credentials check for mock API
  if (password === 'WrongPassword') {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  // Generate mock JWT token
  const mockHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const mockPayload = Buffer.from(JSON.stringify({
    sub: crypto.randomUUID(),
    email,
    role: email.includes('admin') ? 'admin' : 'requester',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  })).toString('base64url');
  const mockSignature = crypto.randomBytes(32).toString('base64url');

  const token = `${mockHeader}.${mockPayload}.${mockSignature}`;

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      email,
      role: email.includes('admin') ? 'admin' : 'requester'
    }
  });
};

export const recordExternalAudit = (req: Request, res: Response): void => {
  const { userId, action, details } = req.body;

  if (!action) {
    res.status(400).json({ error: 'Missing required field: action is required' });
    return;
  }

  const auditEntry = {
    id: crypto.randomUUID(),
    userId: userId || null,
    action,
    details: details || {},
    status: 'recorded',
    timestamp: new Date().toISOString()
  };

  res.status(201).json(auditEntry);
};
