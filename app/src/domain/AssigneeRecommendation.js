class AssigneeRecommendation {
  constructor({ recommendedAssignee, alternateAssignee = null, scoreBreakdown, explanation, explanationSource }) {
    this.recommendedAssignee = recommendedAssignee;
    this.alternateAssignee = alternateAssignee;
    this.scoreBreakdown = scoreBreakdown;
    this.explanation = explanation;
    this.explanationSource = explanationSource;
  }
}

module.exports = AssigneeRecommendation;
