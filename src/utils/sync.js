import { sequelize } from '../models/index.js';
(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log('✅ DB synced');
  process.exit(0);
})();
