const TeamMemberRepository = require('../repositories/TeamMemberRepository');
const TicketAnalyticsRepository = require('../repositories/TicketAnalyticsRepository');
const AiExplanationService = require('./AiExplanationService');
const { calculateCandidateScore } = require('../utils/scoreCalculator');
const AssigneeRecommendation = require('../domain/AssigneeRecommendation');

class AssigneeRecommendationService {
  constructor() {
    this.teamMemberRepository = new TeamMemberRepository();
    this.ticketAnalyticsRepository = new TicketAnalyticsRepository();
    this.aiExplanationService = new AiExplanationService();
  }

  async recommend(input) {
    const teamMembers = await this.teamMemberRepository.findAll();
    const ranked = [];

    for (const member of teamMembers) {
      const historyCount = await this.ticketAnalyticsRepository.getCompletedHistoryCountByMemberAndLabel(member.id, input.label);
      const workload = await this.ticketAnalyticsRepository.getActiveWorkloadByMember(member.id);

      const scoreBreakdown = calculateCandidateScore({
        historyCount,
        activeTodoCount: workload.todo,
        activeInProgressCount: workload.inProgress,
        activeReviewCount: workload.review,
        specializationMatch: member.specialization === input.label
      });

      ranked.push({ member, scoreBreakdown });
    }

    ranked.sort((a, b) => b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore);

    const top = ranked[0];
    const alternate = ranked[1] || null;

    const summary = {
      title: input.title,
      label: input.label,
      dueDate: input.dueDate || null,
      recommendedAssignee: top.member,
      alternateAssignee: alternate ? alternate.member : null,
      scoreBreakdown: top.scoreBreakdown
    };

    const explanationResult = await this.aiExplanationService.getExplanation(summary);

    return new AssigneeRecommendation({
      recommendedAssignee: top.member,
      alternateAssignee: alternate ? alternate.member : null,
      scoreBreakdown: top.scoreBreakdown,
      explanation: explanationResult.explanation,
      explanationSource: explanationResult.explanationSource
    });
  }
}

module.exports = AssigneeRecommendationService;

