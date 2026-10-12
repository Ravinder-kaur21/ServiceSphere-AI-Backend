import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { USER_ROLES, USER_STATUS } from '../utils/roles.js';

const users = [
  {
    id: 'u1',
    name: 'Aman Sharma',
    email: 'admin@servicesphere.ai',
    passwordHash: bcrypt.hashSync('Admin@123', 10),
    phone: '9876543210',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'u2',
    name: 'Neha Verma',
    email: 'manager@servicesphere.ai',
    passwordHash: bcrypt.hashSync('Manager@123', 10),
    phone: '9876543211',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'u3',
    name: 'Rohit Saini',
    email: 'tech@servicesphere.ai',
    passwordHash: bcrypt.hashSync('Tech@123', 10),
    phone: '9876543212',
    role: 'TECHNICIAN',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'u4',
    name: 'Priya Nair',
    email: 'customer@servicesphere.ai',
    passwordHash: bcrypt.hashSync('Customer@123', 10),
    phone: '9876543213',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const auditLogs = [
  {
    id: 'a1',
    actorId: 'u1',
    action: 'ROLE_CHANGED',
    targetUserId: 'u4',
    changes: { role: { from: 'CUSTOMER', to: 'TECHNICIAN' } },
    createdAt: new Date().toISOString(),
  },
];

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function getAllUsers(query = {}) {
  const { role, status, search } = query;
  let result = [...users].map(sanitizeUser);

  if (role) {
    result = result.filter((user) => user.role === role);
  }

  if (status) {
    result = result.filter((user) => user.status === status);
  }

  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term),
    );
  }

  return result;
}

export function getUserById(id) {
  return users.find((user) => user.id === id);
}

export function getUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

export function createUser(payload) {
  if (!payload.name || String(payload.name).trim().length < 2) {
    throw new Error('Name is required.');
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw new Error('A valid email is required.');
  }

  if (!payload.role || !USER_ROLES.includes(payload.role)) {
    throw new Error('Role must be one of ADMIN, MANAGER, TECHNICIAN, or CUSTOMER.');
  }

  if (getUserByEmail(payload.email)) {
    throw new Error('Email already exists.');
  }

  const newUser = {
    id: `u${users.length + 1}`,
    name: payload.name,
    email: payload.email,
    phone: payload.phone || '',
    role: payload.role,
    status: payload.status || 'ACTIVE',
    passwordHash: bcrypt.hashSync(payload.password || 'Password@123', 10),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  return sanitizeUser(newUser);
}

export function updateUserStatus(id, status) {
  if (!USER_STATUS.includes(status)) {
    throw new Error('Status must be ACTIVE or INACTIVE.');
  }

  const user = getUserById(id);
  if (!user) {
    throw new Error('User not found.');
  }

  user.status = status;
  user.updatedAt = new Date().toISOString();
  return sanitizeUser(user);
}

export function updateUserRole(id, role) {
  if (!USER_ROLES.includes(role)) {
    throw new Error('Invalid role.');
  }

  const user = getUserById(id);
  if (!user) {
    throw new Error('User not found.');
  }

  user.role = role;
  user.updatedAt = new Date().toISOString();
  return sanitizeUser(user);
}

export function loginUser(email, password) {
  const user = getUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw new Error('Invalid email or password.');
  }

  if (user.status !== 'ACTIVE') {
    throw new Error('Account is inactive.');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    config.jwtSecret,
    { expiresIn: '8h' },
  );

  return { token, user: sanitizeUser(user) };
}

export function getAuditLogs(targetUserId) {
  if (targetUserId) {
    return auditLogs.filter((entry) => entry.targetUserId === targetUserId);
  }

  return auditLogs;
}

export function logAudit(actorId, action, targetUserId, changes = {}) {
  auditLogs.unshift({
    id: `a${auditLogs.length + 1}`,
    actorId,
    action,
    targetUserId,
    changes,
    createdAt: new Date().toISOString(),
  });
}
