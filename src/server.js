import { app } from './app.js';
import { sequelize } from './models/index.js';
import './models/index.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4001;

(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true }); // desarrollo
  app.listen(PORT, () => console.log(`🚀 API lista en http://localhost:${PORT}`));
})();
