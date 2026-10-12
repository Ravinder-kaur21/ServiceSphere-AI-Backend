import express from 'express';
import {
  getAuditLogsHandler,
  overviewSummaryHandler,
  getUserHandler,
  createManagedUserHandler,
  listUsersHandler,
  loginHandler,
  registerHandler,
  updateUserHandler,
  updateUserRoleHandler,
  updateUserStatusHandler,
  workspaceAuditLogsHandler,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { allowRoles } from '../middleware/allowRoles.js';

const router = express.Router();

router.post('/auth/register', registerHandler);
router.post('/auth/login', loginHandler);
router.get('/overview/summary', authenticate, allowRoles('ADMIN', 'MANAGER'), overviewSummaryHandler);
router.get('/audit-logs', authenticate, allowRoles('ADMIN', 'MANAGER'), workspaceAuditLogsHandler);
router.post('/users', authenticate, allowRoles('ADMIN', 'MANAGER'), createManagedUserHandler);
router.get('/users', authenticate, allowRoles('ADMIN', 'MANAGER'), listUsersHandler);
router.get('/users/:id', authenticate, allowRoles('ADMIN', 'MANAGER', 'TECHNICIAN', 'CUSTOMER'), getUserHandler);
router.patch('/users/:id', authenticate, allowRoles('ADMIN', 'MANAGER', 'TECHNICIAN', 'CUSTOMER'), updateUserHandler);
router.patch('/users/:id/status', authenticate, allowRoles('ADMIN', 'MANAGER'), updateUserStatusHandler);
router.patch('/users/:id/role', authenticate, allowRoles('ADMIN', 'MANAGER'), updateUserRoleHandler);
router.get('/users/:id/audit-logs', authenticate, allowRoles('ADMIN', 'MANAGER'), getAuditLogsHandler);

export default router;
