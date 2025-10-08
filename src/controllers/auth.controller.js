// --- Revisión de autenticación (rama Isa) ---

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    //  [ISA] Validación de entrada con mensaje descriptivo
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Faltan campos requeridos en el registro' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email ya registrado' });

    const user = await User.create({ name, email, password, role });
    console.log('🟣 Nuevo usuario registrado:', user.email);

    return res.status(201).json(user);
  } catch (e) {
    console.error('❌ Error en register:', e);
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

    // [ISA] Log informativo de autenticación exitosa
    console.log(`🔐 Usuario autenticado correctamente: ${user.email}`);

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );

    return res.json({ token, user: user.toJSON() });
  } catch (e) {
    console.error('❌ Error en login:', e);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}


