function attachAssigneeName(ticket, teamMembers) {
  const assignee = teamMembers.find((member) => Number(member.id) === Number(ticket.assigneeId));
  return {
    ...ticket,
    assigneeName: assignee ? assignee.name : null
  };
}

module.exports = { attachAssigneeName };
