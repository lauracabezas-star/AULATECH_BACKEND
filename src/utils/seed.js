import { sequelize, User, Equipment } from '../models/index.js';

(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  const admin = await User.findOne({ where: { email: 'admin@aulatech.edu' } });
  if (!admin) {
    await User.create({ name: 'Admin', email: 'admin@aulatech.edu', password: 'admin123', role: 'administrador' });
  }
  if (await Equipment.count() === 0) {
    await Equipment.bulkCreate([
      { name: 'Videobeam Epson 01', type: 'videobeam', location: 'Bloque A-101' },
      { name: 'Computador Dell 15', type: 'computador', location: 'Sala TIC-3' }
    ]);
  }
  console.log('✅ Seed listo');
  process.exit(0);
})();
