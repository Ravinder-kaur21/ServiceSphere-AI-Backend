import test from 'node:test';
import assert from 'node:assert/strict';
import { updateUserRoleHandler, updateUserStatusHandler } from '../server/controllers/userController.js';
import { getAuditLogs } from '../server/services/userService.js';

function responseRecorder() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('role-change audit event retains actual before and after values', async () => {
  const response = responseRecorder();
  await updateUserRoleHandler({
    params: { id: 'u4' },
    body: { role: 'TECHNICIAN' },
    user: { id: 'u1', role: 'ADMIN' },
  }, response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(getAuditLogs('u4')[0].changes.role, { from: 'CUSTOMER', to: 'TECHNICIAN' });
});

test('status-change audit event retains actual before and after values', async () => {
  const response = responseRecorder();
  await updateUserStatusHandler({
    params: { id: 'u2' },
    body: { status: 'INACTIVE' },
    user: { id: 'u1', role: 'ADMIN' },
  }, response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(getAuditLogs('u2')[0].changes.status, { from: 'ACTIVE', to: 'INACTIVE' });
});