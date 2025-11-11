import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import debugRoutes from './routes/debug.routes.js';
import authRoutes from './routes/auth.routes.js';
import equipmentRoutes from './routes/equipment.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import reportRoutes from './routes/report.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const swaggerPath = new URL('../swagger.json', import.meta.url);
let swaggerDocument = {};

try {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  console.log(' Swagger document cargado correctamente');
} catch (err) {
  console.error(' Error cargando swagger.json:', err.message);
}

// Monta Swagger UI en /doc
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/',(req, res) =>
    res.json({ ok: true, name: 'AULATECH API'})
);

app.use('/api/_debug', debugRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reports', reportRoutes);

export default app;

