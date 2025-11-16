import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import {
  createReservation,
  myReservations,
  cancelReservation
} from '../controllers/reservation.controller.js';

import { body, param } from 'express-validator';
import { validationResult } from 'express-validator';

const router = Router();

// Middleware para manejar errores de validación
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/* =======================================================
   🟦 HU01 — CREAR RESERVA (VALIDACIONES + AUTENTICACIÓN)
======================================================= */
router.post(
  '/',
  authRequired,
  [
    body('equipmentId')
      .isInt({ min: 1 })
      .withMessage('El campo equipmentId debe ser numérico'),

    body('date')
      .isISO8601()
      .withMessage('La fecha es inválida'),

    body('startTime')
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('La hora inicial debe tener formato HH:MM')
      .trim(),

    body('endTime')
      .matches(/^\d{2}:\d{2}$/)
      .withMessage('La hora final debe tener formato HH:MM')
      .trim(),

    body('location')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('La ubicación es obligatoria'),

    body('allowWaitlist')
      .optional()
      .isBoolean()
      .withMessage('allowWaitlist debe ser true o false'),
  ],
  validate,
  createReservation
);

/* =======================================================
   🟩 HU05 — OBTENER MIS RESERVAS
======================================================= */
router.get('/my', authRequired, myReservations);

/* =======================================================
   🟥 HU04 — CANCELAR RESERVA
======================================================= */
router.patch(
  '/:id/cancel',
  authRequired,
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El id de la reserva debe ser numérico'),
  ],
  validate,
  cancelReservation
);

export default router;
