const { Command } = require('../models');
const { constants } = require('../utils');

class HelpService {
  async help(message) {
    try {
      const commands = await Command.findAll();
      let text = '';

      text += constants.MESSAGE_HELP;
      text += commands.map((command) => `${command.command} - ${command.description}`).join('\n');

      message.reply(text);
    } catch (error) {
      console.error(error);

      message.reply(constants.MESSAGE_ERROR_TRY_AGAIN);
    }
  }
}

module.exports = HelpService;
