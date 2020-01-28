const { Client } = require('discord.js');
const cron = require('node-cron');

const UrlService = require('../services/UrlService');

const discordConfig = require('../configs/discord');

const client = new Client();
const urlService = new UrlService();

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

      urlService.list(defaultChannel.guild.id, defaultChannel, true);
    });
  });
});

client.on('message', (message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(discordConfig.prefix) !== 0) return;
  if (!message.guild) return;

  const { channel } = message;
  const args = message.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const value = args[0];
  const server = channel.guild.id;

  if (command === 'add') {
    urlService.add(server, value, message);
  }

  if (command === 'remove') {
    urlService.remove(value, message);
  }

  if (command === 'check') {
    urlService.check(value, message);
  }

  if (command === 'list') {
    urlService.list(server, channel, false, message);
  }

  if (command === 'help') {
    urlService.help(message);
  }
});

client.on('guildMemberAdd', (member) => {
  const channel = member.guild.channels.find((ch) => ch.name === 'member-log');

  if (!channel) return;

  channel.send(`Welcome to the server, ${member}`);
});
