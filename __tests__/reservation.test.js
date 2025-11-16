process.env.NODE_ENV = "test";

import request from "supertest";
import { app } from "../src/app.js";
import { sequelize, User, Equipment, Reservation } from "../src/models/index.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("HU01 – Crear reserva", () => {
  let token;

  test("Debe registrar y loguear al usuario", async () => {
    const register = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "user@test.com",
        password: "pass123",
        role: "estudiante"
      });

    expect(register.statusCode).toBe(201);

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "user@test.com",
        password: "pass123"
      });

    expect(login.statusCode).toBe(200);
    token = login.body.token;

    expect(token).toBeDefined();
  });

  test("Debe crear un equipo disponible", async () => {
    const e = await Equipment.create({
      name: "Cámara Sony",
      type: "video",
      location: "Estudio 1",
      status: "disponible"
    });

    expect(e.id).toBeDefined();
  });

  test("Debe permitir crear una reserva válida", async () => {
    const equipment = await Equipment.findOne();

    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        equipmentId: equipment.id,
        date: "2025-01-01",
        startTime: "08:00",
        endTime: "10:00",
        location: "Estudio A"
      });

    // 👇 AGREGADO: Mostrar el error real que devuelve el backend
    if (res.statusCode !== 201) {
      console.log("RESERVA ERROR:", res.body);
    }

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();

    const saved = await Reservation.findByPk(res.body.id);
    expect(saved).not.toBeNull();
  });
});
