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

describe("HU04 – Cancelar reserva", () => {
  let token;
  let reservationId;

  test("Debe registrar usuario, login, equipo y crear reserva", async () => {
    // Registrar usuario
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "CancelTest",
        email: "cancel@test.com",
        password: "pass123",
        role: "estudiante",
      });

    // Login
    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "cancel@test.com",
        password: "pass123",
      });

    expect(login.statusCode).toBe(200);
    token = login.body.token;

    // Crear equipo
    const equipment = await Equipment.create({
      name: "Luz LED",
      type: "iluminación",
      location: "Estudio 5",
      status: "disponible",
    });

    // Crear reserva
    const res = await request(app)
      .post("/api/reservations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        equipmentId: equipment.id,
        date: "2025-03-03",
        startTime: "12:00",
        endTime: "14:00",
        location: "Estudio F",
      });

    expect(res.statusCode).toBe(201);
    reservationId = res.body.id;
    expect(reservationId).toBeDefined();
  });

  test("Debe cancelar la reserva correctamente", async () => {
    const res = await request(app)
      .patch(`/api/reservations/${reservationId}/cancel`)
      .set("Authorization", `Bearer ${token}`);

    if (res.statusCode !== 200) {
      console.log("CANCEL ERROR:", res.body);
    }

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("cancelado");

    // Confirmar cambio en BD
    const dbReservation = await Reservation.findByPk(reservationId);
    expect(dbReservation.status).toBe("cancelado");
  });
});
