export default {
  testEnvironment: "node",

  transform: {},

  // Cargar automáticamente .env.test
  setupFiles: ["dotenv/config"],

  // Ignorar carpetas innecesarias
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // Mayor tiempo para supertest
  testTimeout: 30000,

  // Limpia mocks entre tests
  clearMocks: true
};
