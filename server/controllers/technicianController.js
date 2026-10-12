import { getAvailabilityForTechnician, upsertAvailabilityForTechnician } from '../services/availabilityService.js';
import { getWorkloadForTechnician, getAllWorkloadSummary } from '../services/workloadService.js';
import { getAllUsers, getUserById } from '../services/userService.js';

export async function listTechniciansHandler(req, res) {
  const technicianUsers = getAllUsers({ role: 'TECHNICIAN' });
  return res.json({ success: true, data: technicianUsers });
}

export async function getTechnicianHandler(req, res) {
  const user = getAllUsers({ role: 'TECHNICIAN' }).find((technician) => technician.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Technician profile not found' });
  }

  const workload = getWorkloadForTechnician(req.params.id);
  return res.json({ success: true, data: { user, workload } });
}

export async function updateTechnicianHandler(req, res) {
  const user = getUserById(req.params.id);
  if (!user || user.role !== 'TECHNICIAN') {
    return res.status(404).json({ success: false, message: 'Technician profile not found' });
  }

  const payload = req.body || {};
  if (payload.name) user.name = payload.name;
  if (payload.phone) user.phone = payload.phone;
  if (payload.status) user.status = payload.status;
  user.updatedAt = new Date().toISOString();

  return res.json({ success: true, data: user });
}

export async function getAvailabilityHandler(req, res) {
  const availability = getAvailabilityForTechnician(req.params.id);
  return res.json({ success: true, data: availability });
}

export async function updateAvailabilityHandler(req, res) {
  const record = upsertAvailabilityForTechnician(req.params.id, req.body || {});
  return res.json({ success: true, data: record });
}

export async function getWorkloadHandler(req, res) {
  if (req.params.id) {
    return res.json({ success: true, data: getWorkloadForTechnician(req.params.id) });
  }

  return res.json({ success: true, data: getAllWorkloadSummary() });
}
