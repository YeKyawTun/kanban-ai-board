const TeamMemberRepository = require('../repositories/TeamMemberRepository');

class TeamMemberController {
  constructor() {
    this.repository = new TeamMemberRepository();
  }

  getAll = async (_req, res, next) => {
    try {
      const teamMembers = await this.repository.findAll();
      res.json({ teamMembers });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = TeamMemberController;
