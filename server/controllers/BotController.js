const cluster = require('cluster');
const cron = require('node-cron');

const { discordConfig } = require('../configs');
const { UrlService, HelpService } = require('../services');
const { constants } = require('../utils');

const urlService = new UrlService();
const helpService = new HelpService();

class BotController {
  constructor(bot) {
    this.bot = bot;
  }

  async handle() {
    this.bot.login(discordConfig.token);

    this.bot.on(constants.ON_MESSAGE_CREATE, (message) => {
      if (message.author.bot) return;
      if (message.content.indexOf(discordConfig.prefix) !== 0) return;
      if (!message.guild) return;

      const args = message.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      switch (command) {
        case constants.COMMAND_ADD:
          urlService.add(message);

          break;
        case constants.COMMAND_REMOVE:
          urlService.remove(message);

          break;
        case constants.COMMAND_CHECK:
          urlService.check(message);

          break;
        case constants.COMMAND_LIST:
          urlService.list(message);

          break;
        case constants.COMMAND_HELP:
          helpService.help(message);

          break;
        default:
          urlService.handle(message);

          break;
      }
    });
  }

  async jobs() {
    this.bot.on(constants.ON_READY, () => {
      cron.schedule(constants.CRON, () => {
        if (!cluster.isMaster) {
          return;
        }

        this.bot.guilds.cache.forEach((guild) => {
          let defaultChannel = '';

          guild.channels.cache.forEach((channel) => {
            if (channel.type === constants.ON_GUILD_TEXT && defaultChannel === '') {
              if (channel.permissionsFor(guild.me).has(constants.ON_SEND_MESSAGES)) {
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
