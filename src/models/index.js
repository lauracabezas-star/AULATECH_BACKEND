import { sequelize } from '../config/db.js';
import { User } from './User.js';
import { Equipment } from './Equipment.js';
import { Reservation } from './Reservation.js';
import { Report } from './Report.js';
import { WaitlistEntry } from './WaitlistEntry.js';

User.hasMany(Reservation, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Equipment.hasMany(Reservation, { foreignKey: { name: 'equipmentId', allowNull: false }, onDelete: 'CASCADE' });
Reservation.belongsTo(Equipment, { foreignKey: 'equipmentId' });

User.hasMany(Report, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
Report.belongsTo(User, { foreignKey: 'userId' });

Equipment.hasMany(Report, { foreignKey: { name: 'equipmentId', allowNull: false }, onDelete: 'CASCADE' });
Report.belongsTo(Equipment, { foreignKey: 'equipmentId' });

User.hasMany(WaitlistEntry, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
WaitlistEntry.belongsTo(User, { foreignKey: 'userId' });

Equipment.hasMany(WaitlistEntry, { foreignKey: { name: 'equipmentId', allowNull: false }, onDelete: 'CASCADE' });
WaitlistEntry.belongsTo(Equipment, { foreignKey: 'equipmentId' });

export { sequelize, User, Equipment, Reservation, Report, WaitlistEntry };
