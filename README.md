# AULATECH – Backend (estilo Unisalones)

- Express + Sequelize
- MySQL para desarrollo
- SQLite en pruebas (in-memory)
- JWT + roles (estudiante, profesor, tecnico, administrador)
- Reservas con validación de solape
- Lista de espera básica
- Reportes de fallas
- TDD con Jest + Supertest (mínimo viable)

## Scripts
- `npm run dev` — inicia servidor en desarrollo (Puerto 4001)
- `npm start` — producción (usa .env)
- `npm run db:sync` — sincroniza modelos
- `npm run seed` — crea admin y equipos demo
- `npm test` — corre pruebas con SQLite

## .env (desarrollo con MySQL)
Copia `.env.example` a `.env` y ajusta credenciales MySQL.
