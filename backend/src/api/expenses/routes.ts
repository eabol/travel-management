import { Router } from 'express';
import {
  createTravelExpense,
  updateTravelExpense,
  listTravelExpenses,
  updateTravelExpenseStatus,
  getAuditLogs
} from './controller.js';
import { authenticateJwt, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

/**
 * @openapi
 * /api/v1/travel-expenses:
 *   post:
 *     tags:
 *       - Viáticos (API Interna)
 *     summary: Crea una nueva solicitud de viáticos en estado Draft
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [destination, amount, startDate, endDate]
 *             properties:
 *               destination:
 *                 type: string
 *               amount:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Solicitud creada
 *       400:
 *         description: Payload inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Permisos insuficientes (Rol no permitido)
 */
router.post(
  '/travel-expenses',
  authenticateJwt,
  authorizeRoles('requester', 'admin'),
  createTravelExpense
);

/**
 * @openapi
 * /api/v1/travel-expenses/{id}:
 *   put:
 *     tags:
 *       - Viáticos (API Interna)
 *     summary: Edita una solicitud existente (Solo requester en estado Draft)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destination:
 *                 type: string
 *               amount:
 *                 type: number
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Draft, Submitted]
 *     responses:
 *       200:
 *         description: Solicitud actualizada
 *       400:
 *         description: No se puede editar si no está en estado Draft
 *       403:
 *         description: No se pueden editar solicitudes ajenas
 */
router.put(
  '/travel-expenses/:id',
  authenticateJwt,
  authorizeRoles('requester', 'admin'),
  updateTravelExpense
);

/**
 * @openapi
 * /api/v1/travel-expenses:
 *   get:
 *     tags:
 *       - Viáticos (API Interna)
 *     summary: Lista las solicitudes filtradas según el rol del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de viáticos
 *       401:
 *         description: No autenticado
 */
router.get(
  '/travel-expenses',
  authenticateJwt,
  authorizeRoles('requester', 'approver', 'admin'),
  listTravelExpenses
);

/**
 * @openapi
 * /api/v1/travel-expenses/{id}/status:
 *   patch:
 *     tags:
 *       - Viáticos (API Interna)
 *     summary: Actualiza el estado de una solicitud (Approved / Rejected) y registra evento de auditoría
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Draft, Submitted, Approved, Rejected]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Estado inválido
 *       403:
 *         description: Permisos insuficientes
 */
router.patch(
  '/travel-expenses/:id/status',
  authenticateJwt,
  authorizeRoles('approver', 'admin'),
  updateTravelExpenseStatus
);

/**
 * @openapi
 * /api/v1/audit:
 *   get:
 *     tags:
 *       - Auditoría (API Interna)
 *     summary: Obtiene la bitácora general de auditoría (Exclusivo Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de logs de auditoría
 *       403:
 *         description: Acceso denegado (Requiere rol Admin)
 */
router.get(
  '/audit',
  authenticateJwt,
  authorizeRoles('admin'),
  getAuditLogs
);

export default router;
