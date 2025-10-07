import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Faltan campos' });
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email ya registrado' });
    const user = await User.create({ name, email, password, role });
    return res.status(201).json(user);
  } catch (e) {
    return res.status(500).json({ error: 'Error al registrar' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES || '7d' });
    return res.json({ token, user: user.toJSON() });
  } catch (e) {
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}
