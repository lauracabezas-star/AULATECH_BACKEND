import { Equipment } from '../models/index.js';

export async function listEquipment(req, res) {
  const items = await Equipment.findAll({ order: [['createdAt','DESC']] });
  return res.json(items);
}

export async function createEquipment(req, res) {
  try {
    const { name, type, serialNumber, status, location } = req.body;
    if (!name || !type) return res.status(400).json({ error: 'name y type son obligatorios' });
    const created = await Equipment.create({ name, type, serialNumber, status, location });
    return res.status(201).json(created);
  } catch (e) {
    return res.status(500).json({ error: 'Error al crear equipo' });
  }
}

export async function updateEquipment(req, res) {
  try {
    const { id } = req.params;
    const eq = await Equipment.findByPk(id);
    if (!eq) return res.status(404).json({ error: 'Equipo no encontrado' });
    const { name, type, serialNumber, status, location } = req.body;
    await eq.update({ name, type, serialNumber, status, location });
    return res.json(eq);
  } catch (e) {
    return res.status(500).json({ error: 'Error al actualizar equipo' });
  }
}
