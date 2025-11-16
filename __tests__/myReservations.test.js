process.env.NODE_ENV = "test";

import request from "supertest";
import { app } from "../src/app.js";
import { sequelize, Equipment, Reservation } from "../src/models/index.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("HU05 – Mis reservas", () => {
  let tokenUser1;
  let tokenUser2;

  test("Debe registrar y loguear dos usuarios distintos", async () => {
    // Usuario 1
    await request(app).post("/api/auth/register").send({
      name: "UserOne",
      email: "user1@test.com",
      password: "pass123",
      role: "estudiante",
    });

    const login1 = await request(app).post("/api/auth/login").send({
      email: "user1@test.com",
      password: "pass123",
    });

    tokenUser1 = login1.body.token;
    expect(tokenUser1).toBeDefined();

    // Usuario 2
    await request(app).post("/api/auth/register").send({
      name: "UserTwo",
      email: "user2@test.com",
      password: "pass123",
      role: "estudiante",
    });

    const login2 = await request(app).post("/api/auth/login").send({
      email: "user2@test.com",
      password: "pass123",
    });

    tokenUser2 = login2.body.token;
    expect(tokenUser2).toBeDefined();
  });

  test("Debe crear un equipo para reservar", async () => {
    await Equipment.create({
      name: "Cámara Canon",
      type: "video",
      location: "Estudio X",
      status: "disponible",
    });

    const eq = await Equipment.findOne();
    expect(eq.id).toBeDefined();
  });

  test("Debe crear dos reservas para User1 y una reserva para User2", async () => {
    const eq = await Equipment.findOne();

    // Reserva 1 para User 1
    await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        equipmentId: eq.id,
        date: "2025-05-01",
        startTime: "08:00",
        endTime: "09:00",
        location: "Estudio A",
      });

    // Reserva 2 para User 1
    await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        equipmentId: eq.id,
        date: "2025-05-02",
        startTime: "10:00",
        endTime: "12:00",
        location: "Estudio A",
      });

    // Reserva para User 2
    await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({
        equipmentId: eq.id,
        date: "2025-06-03",
        startTime: "11:00",
        endTime: "12:00",
        location: "Estudio B",
      });

    // Verificación rápida
    const count = await Reservation.count();
    expect(count).toBe(3);
  });

  test("User1 debe ver solo sus reservas, en orden descendente", async () => {
    const res = await request(app)
      .get("/api/reservations/my")
      .set("Authorization", `Bearer ${tokenUser1}`);

    if (res.statusCode !== 200) {
      console.log("MY RES ERROR:", res.body);
    }

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);

    // Orden descendente por fecha y hora
    const first = res.body[0];
    const second = res.body[1];

    expect(first.date >= second.date).toBe(true);
  });
});
