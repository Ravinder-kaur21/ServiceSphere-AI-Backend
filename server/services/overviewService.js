const dateKey = (date) => date.toISOString().slice(0, 10);

export function buildOverviewSummary(users, auditLogs, now = new Date()) {
  const technicians = users
    .filter((user) => user.role === 'TECHNICIAN')
    .map(({ id, name, status }) => ({ id, name, status }));
  const usersById = new Map(users.map((user) => [user.id, user]));
  const trendDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6 + index));
    return { date: dateKey(date), count: 0 };
  });
  const trendByDate = new Map(trendDays.map((day) => [day.date, day]));
  const allUsersHaveCreationDates = users.length > 0 && users.every((user) => Number.isFinite(Date.parse(user.createdAt)));

  if (allUsersHaveCreationDates) {
    for (const user of users) {
      const day = trendByDate.get(dateKey(new Date(user.createdAt)));
      if (day) day.count += 1;
    }
  }

  const recentAudit = auditLogs.slice(0, 5).map((event) => ({
    ...event,
    actorName: usersById.get(event.actorId)?.name || event.actorId,
    targetUserName: usersById.get(event.targetUserId)?.name || event.targetUserId,
  }));

  return {
    counts: {
      totalUsers: users.length,
      activeTechnicians: technicians.filter((technician) => technician.status === 'ACTIVE').length,
      inactiveUsers: users.filter((user) => user.status === 'INACTIVE').length,
      openJobs: null,
    },
    technicians,
    capabilities: {
      jobAssignments: false,
      technicianAvailability: false,
      serviceMetrics: false,
      userTrend: allUsersHaveCreationDates,
    },
    weeklyUserCreation: allUsersHaveCreationDates ? trendDays : null,
    audit: {
      count: auditLogs.length,
      recent: recentAudit,
    },
  };
}