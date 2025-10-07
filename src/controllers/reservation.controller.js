import { Reservation, Equipment, User } from '../models/index.js';
import { enqueueWaitlist } from '../services/waitlist.service.js';

function validRange(startTime, endTime) {
  return startTime && endTime && startTime < endTime;
}

export async function createReservation(req, res) {
  try {
    const { equipmentId, date, startTime, endTime, location, allowWaitlist } = req.body;

    console.log('🟢 Usuario autenticado:', req.user);

    if (!equipmentId || !date || !startTime || !endTime || !location)
      return res.status(400).json({ error: 'Faltan campos' });
    if (!validRange(startTime, endTime))
      return res.status(400).json({ error: 'Rango de horas inválido' });

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment)
      return res.status(404).json({ error: 'Equipo no existe' });
    if (equipment.status !== 'disponible')
      return res.status(409).json({ error: 'Equipo no disponible' });

    const overlap = await Reservation.hasOverlap(equipmentId, date, startTime, endTime);
    if (overlap) {
      if (allowWaitlist) {
        const w = await enqueueWaitlist({
          userId: req.user.id,
          equipmentId,
          date,
          startTime,
          endTime,
          location
        });
        console.log('🟡 Usuario agregado a lista de espera:', w.id);
        return res.status(202).json({
          message: 'Agregado a lista de espera',
          waitlist: w
        });
      }
      return res.status(409).json({ error: 'Cruce de horario detectado' });
    }

    const created = await Reservation.create({
      equipmentId,
      userId: req.user.id,
      date,
      startTime,
      endTime,
      location,
      status: 'confirmado'
    });

    console.log('✅ Reserva creada correctamente:', created.toJSON());
    return res.status(201).json(created);
  } catch (e) {
    console.error('❌ Error en createReservation:', e);
    return res.status(500).json({ error: 'Error al crear reserva' });
  }
}

export async function myReservations(req, res) {
  try {
    console.log('🟢 Consultando reservas para el usuario:', req.user);

    const list = await Reservation.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Equipment, attributes: ['id', 'name', 'type', 'location'] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
      order: [['date', 'DESC'], ['startTime', 'DESC']]
    });

    console.log(`📦 ${list.length} reservas encontradas`);
    return res.json(list);
  } catch (e) {
    console.error('❌ Error en myReservations:', e);
    return res.status(500).json({ error: 'Error al obtener reservas' });
  }
}

export async function cancelReservation(req, res) {
  try {
    const { id } = req.params;
    const r = await Reservation.findByPk(id);
    if (!r)
      return res.status(404).json({ error: 'Reserva no encontrada' });
    if (r.userId !== req.user.id && !['administrador'].includes(req.user.role))
      return res.status(403).json({ error: 'No autorizado' });

    await r.update({ status: 'cancelado' });
    console.log('🟠 Reserva cancelada:', id);
    return res.json(r);
  } catch (e) {
    console.error('❌ Error en cancelReservation:', e);
    return res.status(500).json({ error: 'Error al cancelar reserva' });
  }
}
