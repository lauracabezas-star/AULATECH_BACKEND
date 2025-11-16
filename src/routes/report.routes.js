import { Router } from 'express';
import { authRequired, hasRole } from '../middlewares/auth.js';
import {
  createReport,
  listReports,
  updateReportStatus
} from '../controllers/report.controller.js';

import { body, param } from 'express-validator';
import { validationResult } from 'express-validator';

const router = Router();

// Middleware para devolver errores de validación
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/* =======================================================
   🟦 HU02 — CREAR REPORTE DE DAÑO
======================================================= */
router.post(
  '/',
  authRequired,
  [
    body('equipmentId') 
      .isUUID()
      .withMessage('El equipmentId debe ser un UUID válido'),


    body('description')
      .trim()
      .isLength({ min: 10 })
      .withMessage('La descripción debe tener al menos 10 caracteres'),

    body('priority')
      .isIn(['baja', 'media', 'alta', 'critica'])
      .withMessage('La prioridad debe ser baja, media, alta o critica')
  ],
  validate,
  createReport
);

/* =======================================================
   🟩 HU05 — LISTAR REPORTES (solo técnico / admin)
======================================================= */
router.get(
  '/',
  authRequired,
  hasRole('tecnico', 'administrador'),
  listReports
);

/* =======================================================
   🟥 HU06 — ACTUALIZAR ESTADO DEL REPORTE
======================================================= */
router.patch(
  '/:id/status',
  authRequired,
  hasRole('tecnico', 'administrador'),
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El id debe ser un número válido'),

    body('status')
      .isIn(['pendiente', 'en_proceso', 'resuelto'])
      .withMessage('El estado debe ser pendiente, en_proceso o resuelto')
  ],
  validate,
  updateReportStatus
);

export default router;
