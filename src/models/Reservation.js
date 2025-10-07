import { DataTypes, Model, Op } from 'sequelize';
import { sequelize } from '../config/db.js';

export class Reservation extends Model {
  static async hasOverlap(equipmentId, date, startTime, endTime) {
    return await Reservation.findOne({
      where: {
        equipmentId, date,
        status: { [Op.in]: ['pendiente','confirmado'] },
        [Op.and]: [
          { startTime: { [Op.lt]: endTime } },
          { endTime: { [Op.gt]: startTime } }
        ]
      }
    });
  }
}

Reservation.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('pendiente','confirmado','cancelado','completado'), defaultValue: 'confirmado' }
}, { sequelize, modelName: 'reservation', tableName: 'reservations' });
