const { RichEmbed } = require('discord.js');
const isUrl = require('is-url');
const request = require('request');

const { Url } = require('../models');

const discordConfig = require('../configs/discord');

class UrlService {
  add(server, url, message) {
    if (url === '') {
      message.reply('URL must not be empty');
    } else if (!url.includes('http://') && !url.includes('https://')) {
      message.reply('Set http or https on URL');
    } else if (!isUrl(url)) {
      message.reply('Invalid URL');
    } else {
      Url.findOne({ where: { server, url } }).then((e) => {
        if (e !== null) {
          message.reply('URL already exists');
        } else {
          Url.create({ server, url }).then(() => {
            message.reply('URL added');
          }).catch(() => {
            message.reply('Error, try again');
          });
        }
      });
    }
  }

  remove(id, message) {
    if (id === undefined || id === null || id === '') {
      message.reply('ID must not be empty');
    } else {
      Url.findOne({ where: { id } }).then((e) => {
        if (e === null) {
          message.reply('URL not found');
        } else {
          e.destroy().then(() => {
            message.reply('URL removed');
          }).catch(() => {
            message.reply('Error, try again');
          });
        }
      });
    }
  }

  list(server, channel, worker, message) {
    Url.findAll({ where: { server } }).then((response) => {
      if (!worker && (response === null || response.length === 0)) {
        message.reply('Use !izup add [URL] to add new URL');
      } else {
        response.forEach((e) => {
          const embed = new RichEmbed().setTitle('').setColor().setDescription(`${e.id} - ${e.url}`);

          request(e.url, (error) => {
            embed.setTitle(`${error ? 'Offline' : 'Online'}`);
            embed.setColor(`${error ? 'RED' : 'GREEN'}`);

            if (!worker || error) {
              channel.send(embed);
            }
          });
        });
      }
    }).catch((error) => {
      channel.send(error);
    });
  }

  check(url, message) {
    if (url === undefined || url === null || url === '') {
      message.reply('URL must not be empty');
    } else if (!url.includes('http://') && !url.includes('https://')) {
      message.reply('Set http or https on URL');
    } else if (!isUrl(url)) {
      message.reply('Invalid URL');
    } else {
      request(url, (error) => {
        if (error) {
          message.reply(`${url} is offline!`);
        } else {
          message.reply(`${url} is online!`);
        }
      });
    }
  }

  help(message) {
    message.reply(`\n${discordConfig.prefix} add [URL] - Add URL\n${discordConfig.prefix} remove [ID] - Remove URL\n${discordConfig.prefix} check [URL] - Check URL\n${discordConfig.prefix} list - List URL's`);
  }
}

module.exports = UrlService;
