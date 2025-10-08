import { Equipment } from '../models/index.js';

export async function listEquipment(req, res) {
  try {
    const items = await Equipment.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los equipos' });
  }
}

export async function createEquipment(req, res) {
  try {
    const { name, type, serialNumber, status, location } = req.body;
    if (!name || !type) return res.status(400).json({ error: 'Faltan campos' });

    const created = await Equipment.create({
      name,
      type,
      serialNumber,
      status,
      location
    });

    return res.status(201).json(created);
  } catch (e) {
    return res.status(500).json({ error: 'Error al crear equipo' });
  }
}

export async function updateEquipment(req, res) {
  try {
    const { id } = req.params;
    const { status, location } = req.body;
    const eq = await Equipment.findByPk(id);
    if (!eq) return res.status(404).json({ error: 'Equipo no encontrado' });
    await eq.update({ status, location });
    return res.json(eq);
  } catch (e) {
    return res.status(500).json({ error: 'Error al actualizar equipo' });
  }
}
