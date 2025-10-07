import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

export class Report extends Model {}

Report.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  description: { type: DataTypes.TEXT, allowNull: false },
  photoUrl: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.ENUM('pendiente','en_proceso','resuelto'), defaultValue: 'pendiente' },
  priority: { type: DataTypes.ENUM('baja','media','alta','critica'), defaultValue: 'media' }
}, { sequelize, modelName: 'report', tableName: 'reports' });
