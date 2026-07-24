import { Router } from 'express';
import { registerExternalUser, externalLogin, recordExternalAudit } from './controller.js';

const router = Router();

/**
 * @openapi
 * /api/v1/external/users:
 *   post:
 *     tags:
 *       - API Externa (Mock)
 *     summary: Registra un usuario externo y genera un API Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Campos obligatorios faltantes
 */
router.post('/users', registerExternalUser);

/**
 * @openapi
 * /api/v1/external/login:
 *   post:
 *     tags:
 *       - API Externa (Mock)
 *     summary: Autentica credenciales y devuelve un token JWT de sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       400:
 *         description: Credenciales no provistas
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', externalLogin);

/**
 * @openapi
 * /api/v1/external/audit:
 *   post:
 *     tags:
 *       - API Externa (Mock)
 *     summary: Registra un evento en la bitácora de auditoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               userId:
 *                 type: string
 *               action:
 *                 type: string
 *               details:
 *                 type: object
 *     responses:
 *       201:
 *         description: Evento de auditoría registrado
 *       400:
 *         description: Acción no provista
 */
router.post('/audit', recordExternalAudit);

export default router;
