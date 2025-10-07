import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcryptjs';

export class User extends Model {
  toJSON() {
    const v = { ...this.get() };
    delete v.password;
    return v;
  }
}

User.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('estudiante','profesor','tecnico','administrador'), defaultValue: 'estudiante' }
}, { sequelize, modelName: 'user', tableName: 'users' });

async function hashIfChanged(user) {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
}
User.beforeCreate(hashIfChanged);
User.beforeUpdate(hashIfChanged);
