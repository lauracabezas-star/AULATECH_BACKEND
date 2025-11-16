import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const payload = { id: user.id, role: user.role, name: user.name };
    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES || '7d'
    });

    return res.json({ token, user: user.toJSON() });
  } catch (e) {
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}
