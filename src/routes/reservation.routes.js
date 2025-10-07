import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { createReservation, myReservations, cancelReservation } from '../controllers/reservation.controller.js';
const router = Router();
router.post('/', authRequired, createReservation);
router.get('/my', authRequired, myReservations);
router.patch('/:id/cancel', authRequired, cancelReservation);
export default router;
