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

describe("HU02 – Crear reporte de daño", () => {
  let token;
  let equipmentId;

  test("Debe registrar y loguear usuario", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "UserReport",
        email: "report@test.com",
        password: "pass123",
        role: "estudiante"
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "report@test.com",
        password: "pass123"
      });

    expect(login.statusCode).toBe(200);
    token = login.body.token;
    expect(token).toBeDefined();
  });

  test("Debe crear un equipo para poder reportarlo", async () => {
    const eq = await Equipment.create({
      name: "Trípode",
      type: "soporte",
      location: "Bodega",
      status: "disponible"
    });

    equipmentId = eq.id;
    expect(equipmentId).toBeDefined();
  });

  test("Debe permitir crear un reporte válido", async () => {
    const res = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${token}`)
      .send({
        equipmentId,
        description: "El trípode está roto en la parte superior",
        priority: "alta"
      });

    // Si algo falla imprime el error real
    if (res.statusCode !== 201) {
      console.log("REPORTE ERROR:", res.body);
    }

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe("pendiente");

    // Validación en BD
    const dbReport = await Report.findByPk(res.body.id);
    expect(dbReport).not.toBeNull();
    expect(dbReport.description).toContain("trípode");
  });
});
