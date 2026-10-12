import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canManageRole,
  validateUserPayload,
  isLastActiveAdmin,
  canMutateUser,
} from '../server/services/authorization.js';

test('allows admin to manage any role', () => {
  assert.equal(canManageRole('ADMIN', 'TECHNICIAN'), true);
});

test('prevents manager from creating admin', () => {
  assert.equal(canManageRole('MANAGER', 'ADMIN'), false);
});

test('rejects invalid user payload fields', () => {
  const errors = validateUserPayload({
    name: 'A',
    email: 'bad-email',
    role: 'OWNER',
    status: 'ARCHIVED',
  });

  assert.ok(errors.length >= 4);
});

test('blocks last active admin demotion', () => {
  assert.equal(isLastActiveAdmin(1), true);
  assert.equal(isLastActiveAdmin(2), false);
});

test('only admin or same user can mutate user records', () => {
  assert.equal(canMutateUser({ id: 'u1', role: 'ADMIN' }, { id: 'u2' }), true);
  assert.equal(canMutateUser({ id: 'u1', role: 'MANAGER' }, { id: 'u2' }), false);
  assert.equal(canMutateUser({ id: 'u1', role: 'MANAGER' }, { id: 'u1' }), true);
});
