import { WaitlistEntry, Reservation } from '../models/index.js';

export async function enqueueWaitlist({ userId, equipmentId, date, startTime, endTime, location }) {
  return await WaitlistEntry.create({ userId, equipmentId, date, startTime, endTime, location });
}
