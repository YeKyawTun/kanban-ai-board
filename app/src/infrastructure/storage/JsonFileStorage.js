const fs = require('fs/promises');

class JsonFileStorage {
  async readArray(filePath) {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error(`Expected array in ${filePath}`);
    }
    return parsed;
  }

  async writeArray(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}

module.exports = JsonFileStorage;
