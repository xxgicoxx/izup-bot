const { discordConfig } = require('../configs');

class HelpService {
  async help($) {
    try {
      const message = `I can help you check servers.\n\nYou can control me by sending these commands:\n\n${discordConfig.prefix} add [URL] - Add URL\n${discordConfig.prefix} remove [ID] - Remove URL\n${discordConfig.prefix} check [URL] - Check URL\n${discordConfig.prefix} list - List servers`;

      $.reply(message);
    } catch (error) {
      console.error(error);

      $.reply('Error, try again later');
    }
  }
}

module.exports = HelpService;
