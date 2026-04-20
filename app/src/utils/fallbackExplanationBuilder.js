function buildFallbackExplanation(summary) {
  const {
    recommendedAssignee,
    title,
    label,
    scoreBreakdown,
    alternateAssignee
  } = summary;

  const parts = [];

  if (scoreBreakdown.specializationBonus > 0) {
    parts.push(
      `${recommendedAssignee.name} was recommended for the "${title}" ${label} ticket due to his specialization bonus of ${scoreBreakdown.specializationBonus}.`
    );
  } else {
    parts.push(
      `${recommendedAssignee.name} was recommended for the "${title}" ${label} ticket based on the overall score.`
    );
  }

  if (scoreBreakdown.historyScore > 0) {
    parts.push(`They have prior history with similar tasks.`);
  } else {
    parts.push(`There is no prior history with similar tasks.`);
  }

  if (scoreBreakdown.workloadPenalty > 0) {
    parts.push(`Current workload penalty is ${scoreBreakdown.workloadPenalty}.`);
  } else {
    parts.push(`There is no workload penalty.`);
  }

  if (alternateAssignee) {
    parts.push(`${alternateAssignee.name} is the alternate assignee.`);
  }

  return parts.join(' ');
}

module.exports = { buildFallbackExplanation };

