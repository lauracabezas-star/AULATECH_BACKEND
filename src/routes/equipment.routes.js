import { Router } from 'express';
import { listEquipment, createEquipment, updateEquipment } from '../controllers/equipment.controller.js';
import { authRequired, hasRole } from '../middlewares/auth.js';
const router = Router();
router.get('/', authRequired, listEquipment);
router.post('/', authRequired, hasRole('tecnico','administrador'), createEquipment);
router.patch('/:id', authRequired, hasRole('tecnico','administrador'), updateEquipment);
export default router;
