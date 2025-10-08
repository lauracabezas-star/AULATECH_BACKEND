# AULATECH – Backend (Gestión de recuersos audiovisuales)

Backend desarrollado para el royecto AULATECH, cuyo propósito es gestionar los equipos audiovisuales institucionales. Este proyecto sigue el patrón MVC, se implementaron entornos como Node.js y Sequelize, su enfoque fue en TDD.


## Descripción del proyecto
AulaTech permite a los usuarios (estudiantes) gestionar la reserva de un equipo, reportar daño de un equipo, confirmar o cancelar reserva y gestionar incidentes. 
El sistema ofrece funcionalidades para que la gestión de equipos cumpla con las expectativas de los usuarios.

Objetivo:
Desarrollar un backend para la gestión de equipos audiovisuales universitarios, que cumpla con los criterios de aceptación definidos en las historias de usuario del Spring Backlog.


## Estructura del proyecto 

AULATECH_BACKEND/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── tests/
│
└── (archivos raíz como .env.example, package.json, etc.)

## Scripts
- npm run dev — inicia servidor en desarrollo
- npm start — producción (usa .env)
- npm run db:sync — sincroniza modelos
- npm test — corre pruebas con MySQL Workbench

## Entorno de ejecución 

| Variable      | Descripción                                  | Ejemplo        |
| ------------- | -------------------------------------------- | -------------- |
| `NODE_ENV`    | Define el entorno                            | `development`  |
| `DB_USER`     | Usuario de la base de datos                  | `root`         |
| `DB_PASS`     | Contraseña de la base de datos               | `123456`       |
| `DB_NAME`     | Nombre de la base de datos                   | `aulatech_dev` |
| `DB_HOST`     | Host de MySQL                                | `localhost`    |
| `DB_PORT`     | Puerto de conexión                           | `3306`         |
| `JWT_SECRET`  | Clave de firma de tokens                     | `secret`       |
| `JWT_EXPIRES` | Duración del token                           | `7d`           |


##  Endpoints de la API

### Autenticación (auth.controller.js)

POST /api/auth/register – Registrar nuevo usuario
POST /api/auth/login – Iniciar sesión

### Equipos (equipment.controller.js)

GET /api/equipment – Listar todos los equipos
GET /api/equipment/:id – Obtener equipo por ID
POST /api/equipment – Crear nuevo equipo (técnico o administrador)
PATCH /api/equipment/:id – Actualizar equipo (técnico o administrador)
DELETE /api/equipment/:id – Eliminar equipo (administrador)

### Usuarios (user.controller.js)

GET /api/users – Listar todos los usuarios (solo admin)
GET /api/users/:id – Obtener usuario por ID
POST /api/users – Crear nuevo usuario (solo admin)
PUT /api/users/:id – Actualizar usuario existente
DELETE /api/users/:id – Eliminar usuario

### Reservas (reservation.controller.js)

POST /api/reservations – Crear nueva reserva
GET /api/reservations/my – Listar reservas del usuario autenticado
PUT /api/reservations/:id – Actualizar una reserva 
PATCH /api/reservations/:id/cancel – Cancelar una reserva existente
GET /api/reservations/historial - Ver historial de reservas

### Reportes (report.controller.js)

POST /api/reports – Crear reporte de falla o mantenimiento
GET /api/reports – Listar todos los reportes (técnico o administrador)
GET /api/reports/:id – Obtener un reporte por ID
PATCH /api/reports/:id/status – Actualizar estado del reporte


## Roles de Usuario

- estudiante: Puede hacer reservas y reportar fallas
- profesor: Puede hacer reservas y ver historial
- tecnico: Puede gestionar reportes de fallas


## Historias de Usuario Implementadas

- ✅ HU01: Reservar un videobeam
- ✅ HU02: Reportar daño en equipo
- ⚠ HU03: Confirmación por correo 
- ✅ HU04: Cancelar una reserva
- ✅ HU05: Ver historial de reservas
- ✅ HU06: Gestión de incidentes


##  Equipo de Desarrollo

- Laura Isabel Cabezas Sanchez
- Andres Santiago Muñoz Bravo


## Proyecto ingenieria de software II
