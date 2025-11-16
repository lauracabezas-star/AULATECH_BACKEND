// Servicio de correo simulado para HU03

export async function sendReservationEmail(user, reservation, equipment) {
  try {
    console.log(`
📧 SIMULACIÓN DE ENVÍO DE CORREO
---------------------------------------
Para: ${user.email}
Usuario: ${user.name}
Equipo: ${equipment.name}
Tipo: ${equipment.type}
Fecha: ${reservation.date}
Horario: ${reservation.startTime} - ${reservation.endTime}
Ubicación: ${reservation.location}
---------------------------------------
Correo simulado enviado correctamente.
`);
  } catch (e) {
    console.error("❌ Error simulando envío de correo:", e);
  }
}
