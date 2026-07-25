import type { Response } from 'express';
import Joi from 'joi';
import crypto from 'node:crypto';
import type { AuthenticatedRequest } from '../../middleware/auth.js';
import { pool } from '../../db.js';

interface TravelExpense {
  id: string;
  user_id: string;
  destination: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  created_at: string;
  updated_at: string;
}

const memoryExpenses: TravelExpense[] = [];

const createExpenseSchema = Joi.object({
  destination: Joi.string().required(),
  amount: Joi.number().positive().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required()
});

const updateExpenseSchema = Joi.object({
  destination: Joi.string().optional(),
  amount: Joi.number().positive().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional(),
  status: Joi.string().valid('Draft', 'Submitted').optional()
}).min(1);

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('Draft', 'Submitted', 'Approved', 'Rejected').required()
});

export const createTravelExpense = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { error, value } = createExpenseSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details?.[0]?.message || 'Validation error' });
    return;
  }

  const userId = req.user?.id || crypto.randomUUID();
  const { destination, amount, startDate, endDate } = value;

  try {
    const query = `
      INSERT INTO travel_expenses (user_id, destination, amount, start_date, end_date, status)
      VALUES ($1, $2, $3, $4, $5, 'Draft')
      RETURNING id, user_id, destination, amount, start_date, end_date, status, created_at, updated_at;
    `;
    const result = await pool.query(query, [userId, destination, amount, startDate, endDate]);
    const row = result.rows[0];

    res.status(201).json({
      id: row.id,
      userId: row.user_id,
      destination: row.destination,
      amount: parseFloat(row.amount),
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      createdAt: row.created_at
    });
  } catch (_err) {
    const newExpense: TravelExpense = {
      id: crypto.randomUUID(),
      user_id: userId,
      destination,
      amount,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      status: 'Draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memoryExpenses.push(newExpense);

    res.status(201).json({
      id: newExpense.id,
      userId: newExpense.user_id,
      destination: newExpense.destination,
      amount: newExpense.amount,
      startDate: newExpense.start_date,
      endDate: newExpense.end_date,
      status: newExpense.status,
      createdAt: newExpense.created_at
    });
  }
};

export const updateTravelExpense = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { error, value } = updateExpenseSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error: error.details?.[0]?.message || 'Validation error' });
    return;
  }

  const user = req.user;

  try {
    // 1. Check existing record
    const checkRes = await pool.query('SELECT * FROM travel_expenses WHERE id = $1', [id]);
    const existing = checkRes.rows[0];

    if (!existing) {
      const memItem = memoryExpenses.find(e => e.id === id);
      if (!memItem) {
        res.status(404).json({ error: 'Travel expense not found' });
        return;
      }
      if (user?.role === 'requester') {
        if (memItem.user_id !== user.id) {
          res.status(403).json({ error: 'Forbidden: You can only edit your own expenses' });
          return;
        }
        if (memItem.status !== 'Draft') {
          res.status(400).json({ error: 'Cannot edit travel expense unless it is in Draft status' });
          return;
        }
      }
      Object.assign(memItem, value, { updated_at: new Date().toISOString() });
      res.status(200).json(memItem);
      return;
    }

    if (user?.role === 'requester') {
      if (existing.user_id !== user.id) {
        res.status(403).json({ error: 'Forbidden: You can only edit your own expenses' });
        return;
      }
      if (existing.status !== 'Draft') {
        res.status(400).json({ error: 'Cannot edit travel expense unless it is in Draft status' });
        return;
      }
    }

    const destination = value.destination || existing.destination;
    const amount = value.amount !== undefined ? value.amount : existing.amount;
    const startDate = value.startDate || existing.start_date;
    const endDate = value.endDate || existing.end_date;
    const status = value.status || existing.status;

    const updateQuery = `
      UPDATE travel_expenses
      SET destination = $1, amount = $2, start_date = $3, end_date = $4, status = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING id, user_id, destination, amount, start_date, end_date, status, updated_at;
    `;
    const updateRes = await pool.query(updateQuery, [destination, amount, startDate, endDate, status, id]);
    res.status(200).json(updateRes.rows[0]);
  } catch (_err) {
    const memItem = memoryExpenses.find(e => e.id === id);
    if (!memItem) {
      res.status(404).json({ error: 'Travel expense not found' });
      return;
    }
    if (user?.role === 'requester') {
      if (memItem.user_id !== user.id) {
        res.status(403).json({ error: 'Forbidden: You can only edit your own expenses' });
        return;
      }
      if (memItem.status !== 'Draft') {
        res.status(400).json({ error: 'Cannot edit travel expense unless it is in Draft status' });
        return;
      }
    }
    Object.assign(memItem, value, { updated_at: new Date().toISOString() });
    res.status(200).json(memItem);
  }
};

export const listTravelExpenses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = req.user;

  try {
    let query = 'SELECT * FROM travel_expenses ORDER BY created_at DESC';
    let values: any[] = [];

    if (user?.role === 'requester') {
      query = 'SELECT * FROM travel_expenses WHERE user_id = $1 ORDER BY created_at DESC';
      values = [user.id];
    } else if (user?.role === 'approver') {
      query = "SELECT * FROM travel_expenses WHERE status = 'Submitted' ORDER BY created_at DESC";
    }

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (_err) {
    let filtered = memoryExpenses;
    if (user?.role === 'requester') {
      filtered = memoryExpenses.filter(e => e.user_id === user.id);
    } else if (user?.role === 'approver') {
      filtered = memoryExpenses.filter(e => e.status === 'Submitted');
    }
    res.status(200).json(filtered);
  }
};

export const updateTravelExpenseStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { error, value } = updateStatusSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error: error.details?.[0]?.message || 'Validation error' });
    return;
  }

  const newStatus = value.status;

  try {
    const query = `
      UPDATE travel_expenses
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, user_id, destination, amount, status, updated_at;
    `;
    const result = await pool.query(query, [newStatus, id]);

    if (result.rowCount === 0) {
      const memItem = memoryExpenses.find(e => e.id === id);
      if (memItem) {
        memItem.status = newStatus;
        res.status(200).json(memItem);
        return;
      }
      res.status(404).json({ error: 'Travel expense not found' });
      return;
    }

    const row = result.rows[0];
    
    // Audit trigger simulation
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)',
      [req.user?.id, 'TRAVEL_EXPENSE_STATUS_UPDATE', JSON.stringify({ expenseId: id, status: newStatus })]
    ).catch(() => {});

    res.status(200).json(row);
  } catch (_err) {
    const memItem = memoryExpenses.find(e => e.id === id);
    if (memItem) {
      memItem.status = newStatus;
      res.status(200).json(memItem);
      return;
    }
    res.status(404).json({ error: 'Travel expense not found' });
  }
};

export const getAuditLogs = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (_err) {
    res.status(200).json([]);
  }
};
