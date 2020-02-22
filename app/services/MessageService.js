
const { discordConfig } = require('../configs');

class MessageService {
  async handle($) {
    try {
      const message = 'Command not found';

      $.reply(message);
    } catch (ex) {
      console.error(ex);

      $.reply('Error, try again later');
    }
  }

  async ready() {
    try {
      const message = 'Discord bot online!';

      console.log(message);
    } catch (ex) {
      console.error(ex);
    }
  }

  async hello($) {
    try {
      const channel = $.guild.channels.find((ch) => ch.name === 'member-log');

      if (!channel) return;

      channel.send(`Welcome to the server, ${$}`);
    } catch (ex) {
      console.error(ex);

      $.reply('Error, try again later');
    }
  }

  async help($) {
    try {
      const message = `I can help you check servers.\n\nYou can control me by sending these commands:\n\n${discordConfig.prefix} add [URL] - Add URL\n${discordConfig.prefix} remove [ID] - Remove URL\n${discordConfig.prefix} check [URL] - Check URL\n${discordConfig.prefix} list - List servers`;

      $.reply(message);
    } catch (ex) {
      console.error(ex);

      $.reply('Error, try again later');
    }
  }
}

module.exports = MessageService;
