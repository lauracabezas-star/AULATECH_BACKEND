import { Router } from 'express';
import { authRequired, hasRole } from '../middlewares/auth.js';
import { createReport, listReports, updateReportStatus } from '../controllers/report.controller.js';
const router = Router();
router.post('/', authRequired, createReport);
router.get('/', authRequired, hasRole('tecnico','administrador'), listReports);
router.patch('/:id/status', authRequired, hasRole('tecnico','administrador'), updateReportStatus);
export default router;
