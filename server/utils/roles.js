export const USER_ROLES = ['ADMIN', 'MANAGER', 'TECHNICIAN', 'CUSTOMER'];
export const USER_STATUS = ['ACTIVE', 'INACTIVE'];
export const TECHNICIAN_EMPLOYMENT_STATUS = ['ACTIVE', 'INACTIVE', 'ON_LEAVE'];

export function isAllowedRole(role) {
  return USER_ROLES.includes(role);
}

export function isAllowedStatus(status) {
  return USER_STATUS.includes(status);
}

export function isAdminRole(role) {
  return role === 'ADMIN';
}

export function isManagerRole(role) {
  return role === 'MANAGER';
}

export function isTechnicianRole(role) {
  return role === 'TECHNICIAN';
}

export function isCustomerRole(role) {
  return role === 'CUSTOMER';
}
