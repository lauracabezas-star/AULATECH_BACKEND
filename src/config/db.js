import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';

let sequelize;

if (env === 'test') {
  // SQLite en memoria para pruebas
  sequelize = new Sequelize('sqlite::memory:', {
    logging: false,
  });
} else {
  // MySQL para desarrollo
  sequelize = new Sequelize(
    process.env.DB_NAME || 'aulatech_dev',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      dialect: process.env.DB_DIALECT || 'mysql',
      logging: env === 'development' ? console.log : false,
    }
  );
}

export { sequelize };
