// Archivo: __tests__/auth.test.js

process.env.NODE_ENV = "test";

import request from "supertest";
import { app } from "../src/app.js";
import { sequelize } from "../src/models/index.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("HU00 – Login de administrador", () => {
  test("El login debe funcionar correctamente", async () => {
    // 1. Registrar usuario
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin",
        email: "admin@test.com",
        password: "admin123",
        role: "administrador"
      });

    expect(registerRes.statusCode).toBe(201);

    // 2. Hacer login
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",
        password: "admin123"
      });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user).toBeDefined();
    expect(loginRes.body.user.email).toBe("admin@test.com");
  });
});
