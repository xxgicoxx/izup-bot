const cron = require('node-cron');

const { discordConfig } = require('../configs');
const { UrlService, HelpService } = require('../services');

const urlService = new UrlService();
const helpService = new HelpService();

class BotController {
  constructor(bot) {
    this.bot = bot;
  }

  async handle() {
    this.bot.login(discordConfig.token);

    this.bot.on('messageCreate', (message) => {
      if (message.author.bot) return;
      if (message.content.indexOf(discordConfig.prefix) !== 0) return;
      if (!message.guild) return;

      const args = message.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      switch (command) {
        case 'add':
          urlService.add(message);
          break;
        case 'remove':
          urlService.remove(message);
          break;
        case 'check':
          urlService.check(message);
          break;
        case 'list':
          urlService.list(message);
          break;
        case 'help':
          helpService.help(message);
          break;
        default:
          urlService.handle(message);
          break;
      }
    });
  }

  async jobs() {
    this.bot.on('ready', () => {
      cron.schedule('*/5 * * * *', () => {
        this.bot.guilds.cache.forEach((guild) => {
          let defaultChannel = '';

          guild.channels.cache.forEach((channel) => {
            if (channel.type === 'GUILD_TEXT' && defaultChannel === '') {
              if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
                defaultChannel = channel;
              }
            }
          });

          urlService.jobs(defaultChannel);
        });
      });

      urlService.ready();
    });
  }
}

module.exports = BotController;
