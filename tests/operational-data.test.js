import test from 'node:test';
import assert from 'node:assert/strict';
import { getAvailabilityForTechnician } from '../server/services/availabilityService.js';
import { getWorkloadForTechnician, getAllWorkloadSummary } from '../server/services/workloadService.js';

test('workload is explicitly unavailable when no job-assignment store is connected', () => {
  const workload = getWorkloadForTechnician('u3');

  assert.equal(workload.available, false);
  assert.equal(workload.assignedJobs, null);
  assert.equal(workload.currentWorkload, null);
  assert.deepEqual(workload.jobs, []);
});

test('workload summary only includes supplied technician accounts', () => {
  const summary = getAllWorkloadSummary([{ id: 'u9', name: 'Real Technician', status: 'ACTIVE' }]);

  assert.deepEqual(summary, [{
    technicianId: 'u9',
    name: 'Real Technician',
    status: 'ACTIVE',
    available: false,
    currentWorkload: null,
    maxDailyJobs: null,
    remainingCapacity: null,
    assignedJobs: null,
    availabilityStatus: null,
  }]);
});

test('availability is unreported until a real schedule is stored', () => {
  const availability = getAvailabilityForTechnician('unknown-technician');

  assert.deepEqual(availability.weeklySchedule, []);
  assert.deepEqual(availability.timeOff, []);
  assert.equal(availability.updatedAt, null);
});