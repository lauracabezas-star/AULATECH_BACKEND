import request from 'supertest';
import { app } from '../src/app.js';
import { sequelize, User } from '../src/models/index.js';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.sync({ force: true });
  await User.create({ name: 'Admin', email: 'admin@test.com', password: 'admin123', role: 'administrador' });
});

afterAll(async () => {
  await sequelize.close();
});

test('login works', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'admin123' });
  expect(res.statusCode).toBe(200);
  expect(res.body.token).toBeDefined();
});
