import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

export class Equipment extends Model {}

Equipment.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  serialNumber: { type: DataTypes.STRING, allowNull: true, unique: true },
  status: { type: DataTypes.ENUM('disponible','mantenimiento','inactivo'), defaultValue: 'disponible' },
  location: { type: DataTypes.STRING, allowNull: true }
}, { sequelize, modelName: 'equipment', tableName: 'equipment' });
