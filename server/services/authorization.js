import { USER_ROLES, USER_STATUS } from '../utils/roles.js';

export function validateUserPayload(payload) {
  const errors = [];

  if (!payload.name || String(payload.name).trim().length < 2) {
    errors.push('Name is required.');
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push('A valid email is required.');
  }

  if (payload.role && !USER_ROLES.includes(payload.role)) {
    errors.push('Role must be one of ADMIN, MANAGER, TECHNICIAN, or CUSTOMER.');
  }

  if (payload.status && !USER_STATUS.includes(payload.status)) {
    errors.push('Status must be ACTIVE or INACTIVE.');
  }

  return errors;
}

export function canManageRole(actorRole, targetRole) {
  if (actorRole === 'ADMIN') {
    return true;
  }

  if (actorRole === 'MANAGER') {
    return targetRole !== 'ADMIN';
  }

  return false;
}

export function canMutateUser(actor, targetUser) {
  if (!actor || !targetUser) {
    return false;
  }

  if (actor.role === 'ADMIN') {
    return true;
  }

  if (actor.id === targetUser.id) {
    return true;
  }

  return false;
}

export function isLastActiveAdmin(activeAdminsCount) {
  return activeAdminsCount <= 1;
}
