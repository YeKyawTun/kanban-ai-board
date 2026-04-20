function calculateCandidateScore({ historyCount, activeTodoCount, activeInProgressCount, activeReviewCount, specializationMatch }) {
  const historyScore = historyCount;
  const workloadPenalty = (activeTodoCount * 0.5) + (activeInProgressCount * 1.5) + (activeReviewCount * 1.25);
  const specializationBonus = specializationMatch ? 2 : 0;
  const totalScore = historyScore + specializationBonus - workloadPenalty;

  console.log('calculateCandidateScore inputs:', {
    historyCount,
    activeTodoCount,
    activeInProgressCount,
    activeReviewCount,
    specializationMatch
  });

  console.log('calculateCandidateScore outputs:', {
    historyScore,
    workloadPenalty,
    specializationBonus,
    totalScore: Number(totalScore.toFixed(2))
  });

  return {
    historyScore,
    workloadPenalty,
    specializationBonus,
    totalScore: Number(totalScore.toFixed(2))
  };
}

module.exports = { calculateCandidateScore };

