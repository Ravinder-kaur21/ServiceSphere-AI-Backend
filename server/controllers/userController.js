import { createUser, getAllUsers, getAuditLogs, getUserById, loginUser, updateUserRole, updateUserStatus, logAudit } from '../services/userService.js';
import { canManageRole, isLastActiveAdmin, validateUserPayload } from '../services/authorization.js';
import { buildOverviewSummary } from '../services/overviewService.js';

export async function registerHandler(req, res) {
  try {
    const payload = req.body || {};
    const errors = validateUserPayload(payload);

    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(' ') });
    }

    const createdUser = createUser({ ...payload, password: payload.password || 'Password@123' });
    return res.status(201).json({ success: true, message: 'User created successfully', data: createdUser });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function createManagedUserHandler(req, res) {
  try {
    const payload = req.body || {};
    const errors = validateUserPayload(payload);

    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(' ') });
    }

    if (!canManageRole(req.user.role, payload.role)) {
      return res.status(403).json({ success: false, message: 'You cannot assign this role.' });
    }

    if (!payload.password || String(payload.password).length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const createdUser = createUser(payload);
    logAudit(req.user.id, 'USER_CREATED', createdUser.id, { role: createdUser.role });
    return res.status(201).json({ success: true, message: 'User created successfully', data: createdUser });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function loginHandler(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const result = loginUser(email, password);
    return res.json({ success: true, message: 'Login successful', data: result });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
}

export async function listUsersHandler(req, res) {
  try {
    const users = getAllUsers({
      role: req.query.role,
      status: req.query.status,
      search: req.query.search,
    });

    return res.json({ success: true, data: users });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function overviewSummaryHandler(req, res) {
  return res.json({
    success: true,
    data: buildOverviewSummary(getAllUsers(), getAuditLogs()),
  });
}

export async function workspaceAuditLogsHandler(req, res) {
  return res.json({ success: true, data: getAuditLogs() });
}

export async function getUserHandler(req, res) {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({ success: true, data: user });
}

export async function updateUserHandler(req, res) {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const updates = { ...req.body };
  const allowed = ['name', 'phone'];

  for (const key of Object.keys(updates)) {
    if (!allowed.includes(key)) {
      delete updates[key];
    }
  }

  if (updates.name) user.name = updates.name;
  if (updates.phone) user.phone = updates.phone;
  user.updatedAt = new Date().toISOString();

  logAudit(req.user.id, 'USER_UPDATED', user.id, { updatedFields: Object.keys(updates) });
  return res.json({ success: true, data: user });
}

export async function updateUserStatusHandler(req, res) {
  try {
    const { status } = req.body || {};
    const user = getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'ADMIN' && status === 'INACTIVE' && req.user.role === 'ADMIN') {
      const activeAdmins = getAllUsers({ status: 'ACTIVE' }).filter((entry) => entry.role === 'ADMIN');
      if (isLastActiveAdmin(activeAdmins.length)) {
        return res.status(403).json({ success: false, message: 'The last active administrator cannot be deactivated.' });
      }
    }

    const previousStatus = user.status;
    const updatedUser = updateUserStatus(req.params.id, status);
    logAudit(req.user.id, 'STATUS_CHANGED', req.params.id, { status: { from: previousStatus, to: status } });
    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function updateUserRoleHandler(req, res) {
  try {
    const user = getUserById(req.params.id);
    const { role } = req.body || {};

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.user.role === 'MANAGER' && role === 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Managers cannot promote users to Admin.' });
    }

    if (!canManageRole(req.user.role, role)) {
      return res.status(403).json({ success: false, message: 'You cannot assign this role.' });
    }

    const previousRole = user.role;
    const updatedUser = updateUserRole(req.params.id, role);
    logAudit(req.user.id, 'ROLE_CHANGED', req.params.id, { role: { from: previousRole, to: role } });
    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function getAuditLogsHandler(req, res) {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({ success: true, data: getAuditLogs(req.params.id) });
}
