import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOverviewSummary } from '../server/services/overviewService.js';

test('overview summary counts users, active technicians, inactive users, and audit events', () => {
  const summary = buildOverviewSummary(
    [
      { id: 'u1', role: 'ADMIN', status: 'ACTIVE' },
      { id: 'u2', name: 'Tech Active', role: 'TECHNICIAN', status: 'ACTIVE' },
      { id: 'u3', name: 'Tech Inactive', role: 'TECHNICIAN', status: 'INACTIVE' },
      { id: 'u4', name: 'Customer', role: 'CUSTOMER', status: 'INACTIVE' },
    ],
    [{ id: 'a1' }, { id: 'a2' }],
  );

  assert.deepEqual(summary.counts, {
    totalUsers: 4,
    activeTechnicians: 1,
    inactiveUsers: 2,
    openJobs: null,
  });
  assert.deepEqual(summary.technicians, [
    { id: 'u2', name: 'Tech Active', status: 'ACTIVE' },
    { id: 'u3', name: 'Tech Inactive', status: 'INACTIVE' },
  ]);
  assert.equal(summary.audit.count, 2);
  assert.equal(summary.capabilities.jobAssignments, false);
});

test('overview summary exposes unavailable operational analytics as unavailable', () => {
  const summary = buildOverviewSummary([], []);

  assert.equal(summary.counts.openJobs, null);
  assert.equal(summary.capabilities.jobAssignments, false);
  assert.equal(summary.capabilities.technicianAvailability, false);
  assert.equal(summary.capabilities.serviceMetrics, false);
  assert.equal(summary.capabilities.userTrend, false);
  assert.deepEqual(summary.technicians, []);
});