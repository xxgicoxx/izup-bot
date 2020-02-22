const { Client } = require('discord.js');
const cron = require('node-cron');

const { MessageController, UrlController } = require('./app/controllers');

const { discordConfig } = require('./app/configs');

const client = new Client();
const messageController = new MessageController();
const urlController = new UrlController();

client.login(discordConfig.token);

client.on('ready', () => {
  cron.schedule('*/5 * * * *', () => {
    client.guilds.forEach((guild) => {
      let defaultChannel = '';

      guild.channels.forEach((channel) => {
        if (channel.type === 'text' && defaultChannel === '') {
          if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
            defaultChannel = channel;
          }
        }
      });

      urlController.checkChanges(defaultChannel);
    });
  });

  messageController.ready();
});

client.on('message', ($) => {
  if ($.author.bot) return;
  if ($.content.indexOf(discordConfig.prefix) !== 0) return;
  if (!$.guild) return;

  const args = $.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'add':
      urlController.add($);
      break;
    case 'remove':
      urlController.remove($);
      break;
    case 'check':
      urlController.check($);
      break;
    case 'list':
      urlController.list($);
      break;
    case 'help':
      messageController.help($);
      break;
    default:
      messageController.handle($);
      break;
  }
});

client.on('guildMemberAdd', ($) => {
  messageController.hello($);
});
