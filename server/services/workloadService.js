export function getWorkloadForTechnician(technicianId) {
  return {
    technicianId,
    available: false,
    currentWorkload: null,
    maxDailyJobs: null,
    remainingCapacity: null,
    activeJobs: null,
    completedJobs: null,
    assignedJobs: null,
    jobs: [],
  };
}

export function getAllWorkloadSummary(technicians = []) {
  return technicians.map((technician) => ({
    technicianId: technician.id,
    name: technician.name,
    status: technician.status,
    available: false,
    currentWorkload: null,
    maxDailyJobs: null,
    remainingCapacity: null,
    assignedJobs: null,
    availabilityStatus: null,
  }));
}