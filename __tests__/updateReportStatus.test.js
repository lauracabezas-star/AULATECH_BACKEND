process.env.NODE_ENV = "test";

import request from "supertest";
import { app } from "../src/app.js";
import { sequelize, Equipment, Report } from "../src/models/index.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("HU06 – Cambiar estado del reporte", () => {
  let tecnicoToken;
  let userToken;
  let reportId;

  test("Debe registrar y loguear un técnico y un usuario", async () => {
    // Usuario técnico
    await request(app).post("/api/auth/register").send({
      name: "TechUser",
      email: "tech@test.com",
      password: "pass123",
      role: "tecnico",
    });

    const loginTech = await request(app).post("/api/auth/login").send({
      email: "tech@test.com",
      password: "pass123",
    });

    expect(loginTech.statusCode).toBe(200);
    tecnicoToken = loginTech.body.token;

    // Usuario normal
    await request(app).post("/api/auth/register").send({
      name: "NormalUser",
      email: "user@test.com",
      password: "pass123",
      role: "estudiante",
    });

    const loginUser = await request(app).post("/api/auth/login").send({
      email: "user@test.com",
      password: "pass123",
    });

    expect(loginUser.statusCode).toBe(200);
    userToken = loginUser.body.token;
  });

  test("Debe crear un equipo y un reporte", async () => {
    const eq = await Equipment.create({
      name: "Mezcladora de audio",
      type: "audio",
      location: "Cabina",
      status: "disponible",
    });

    expect(eq.id).toBeDefined();

    const res = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        equipmentId: eq.id,
        description: "La mezcladora no enciende",
        priority: "alta",
      });

    if (res.statusCode !== 201) {
      console.log("ERROR REPORTE:", res.body);
    }

    expect(res.statusCode).toBe(201);
    reportId = res.body.id;

    expect(reportId).toBeDefined();
  });

  test("Debe permitir que un técnico actualice el estado del reporte", async () => {
    const res = await request(app)
      .patch(`/api/reports/${reportId}/status`)
      .set("Authorization", `Bearer ${tecnicoToken}`)
      .send({ status: "en_proceso" });

    if (res.statusCode !== 200) {
      console.log("ERROR UPDATE:", res.body);
    }

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("en_proceso");

    // Confirmación en BD
    const dbReport = await Report.findByPk(reportId);
    expect(dbReport.status).toBe("en_proceso");
  });

  test("NO debe permitir que un estudiante cambie el estado", async () => {
    const res = await request(app)
      .patch(`/api/reports/${reportId}/status`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ status: "resuelto" });

    expect(res.statusCode).toBe(403); // No autorizado
  });
});
