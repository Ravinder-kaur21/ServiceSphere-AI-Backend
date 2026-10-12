import express from 'express';
import {
  getAvailabilityHandler,
  getTechnicianHandler,
  getWorkloadHandler,
  listTechniciansHandler,
  updateAvailabilityHandler,
  updateTechnicianHandler,
} from '../controllers/technicianController.js';
import { authenticate } from '../middleware/authenticate.js';
import { allowRoles } from '../middleware/allowRoles.js';

const router = express.Router();

router.get('/technicians', authenticate, allowRoles('ADMIN', 'MANAGER', 'TECHNICIAN'), listTechniciansHandler);
router.get('/technicians/:id', authenticate, allowRoles('ADMIN', 'MANAGER', 'TECHNICIAN'), getTechnicianHandler);
router.patch('/technicians/:id', authenticate, allowRoles('ADMIN', 'MANAGER', 'TECHNICIAN'), updateTechnicianHandler);
router.get('/technicians/:id/availability', authenticate, allowRoles('ADMIN', 'MANAGER', 'TECHNICIAN'), getAvailabilityHandler);
router.put('/technicians/:id/availability', authenticate, allowRoles('ADMIN', 'MANAGER', 'TECHNICIAN'), updateAvailabilityHandler);
router.get('/technicians/:id/workload', authenticate, allowRoles('ADMIN', 'MANAGER', 'TECHNICIAN'), getWorkloadHandler);

export default router;
