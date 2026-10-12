const availabilityRecords = [];

export function getAvailabilityForTechnician(technicianId) {
  return availabilityRecords.find((record) => record.technicianId === technicianId) || {
    technicianId,
    weeklySchedule: [],
    timeOff: [],
    updatedAt: null,
  };
}

export function upsertAvailabilityForTechnician(technicianId, payload) {
  const existing = availabilityRecords.find((record) => record.technicianId === technicianId);

  if (existing) {
    existing.weeklySchedule = payload.weeklySchedule || existing.weeklySchedule;
    existing.timeOff = payload.timeOff || existing.timeOff;
    existing.updatedAt = new Date().toISOString();
    return existing;
  }

  const record = {
    technicianId,
    weeklySchedule: payload.weeklySchedule || [],
    timeOff: payload.timeOff || [],
    updatedAt: new Date().toISOString(),
  };

  availabilityRecords.push(record);
  return record;
}
