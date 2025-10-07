import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

export class WaitlistEntry extends Model {}

WaitlistEntry.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('activo','notificado','expirado'), defaultValue: 'activo' }
}, { sequelize, modelName: 'waitlist_entry', tableName: 'waitlist' });
