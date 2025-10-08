import { Report } from '../models/index.js';

export async function createReport(req, res) {
  try {
    const { equipmentId, description, photoUrl, priority } = req.body;
    if (!equipmentId || !description) return res.status(400).json({ error: 'Faltan campos' });
    const created = await Report.create({ equipmentId, description, photoUrl, priority, userId: req.user.id });
    return res.status(201).json(created);
  } catch (e) {
    return res.status(500).json({ error: 'Error al crear reporte' });
  }
}

export async function listReports(req, res) {
  const { status } = req.query;
  const where = status ? { status } : undefined;
  const list = await Report.findAll({ where, order: [['createdAt', 'DESC']] });
  return res.json(list);
}

export async function updateReportStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const rep = await Report.findByPk(id);
    if (!rep) return res.status(404).json({ error: 'Reporte no encontrado' });
    await rep.update({ status });
    return res.json(rep);
  } catch (e) {
    return res.status(500).json({ error: 'Error al actualizar reporte' });
  }
}
