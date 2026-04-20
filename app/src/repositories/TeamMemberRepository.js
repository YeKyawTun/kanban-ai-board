const path = require('path');
const JsonFileStorage = require('../infrastructure/storage/JsonFileStorage');

class TeamMemberRepository {
  constructor() {
    this.storage = new JsonFileStorage();
    this.filePath = path.join(__dirname, '../data/teamMembers.json');
  }

  async findAll() {
    return this.storage.readArray(this.filePath);
  }

  async findById(id) {
    const members = await this.findAll();
    return members.find((member) => Number(member.id) === Number(id)) || null;
  }
}

module.exports = TeamMemberRepository;
