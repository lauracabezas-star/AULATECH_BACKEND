import { Router } from 'express';
import { authRequired, hasRole } from '../middlewares/auth.js';
import { sequelize, Reservation, Equipment, User } from '../models/index.js';

const router = Router();

// ¿Quién soy y a qué DB estoy conectado?
router.get('/whoami', authRequired, (req, res) => {
  return res.json({
    user: req.user,                          // id, name, role (viene del JWT)
    dialect: sequelize.getDialect(),         // mysql / sqlite
    env: process.env.NODE_ENV || 'development'
  });
});

// Ver TODAS las reservas (solo admin) para descartar filtro por userId
router.get('/reservations', authRequired, hasRole('administrador'), async (_req, res) => {
  const list = await Reservation.findAll({
    include: [
      { model: User, attributes: ['id','name','email','role'] },
      { model: Equipment, attributes: ['id','name','type'] }
    ],
    order: [['createdAt','DESC']]
  });
  res.json(list);
});

export default router;
