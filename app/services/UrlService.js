const { RichEmbed } = require('discord.js');
const ehUrl = require('eh-url');
const request = require('request');

const { Url } = require('../models');

const { discordConfig } = require('../configs');

class UrlService {
  async handle($) {
    $.reply('Command not found');
  }

  async add($) {
    try {
      const { channel } = $;
      const args = $.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
      const value = args[1];
      const server = channel.guild.id;

      if (value === '') {
        $.reply('URL must not be empty');
      } else {
        const validUrl = await ehUrl(value);

        if (!validUrl) {
          $.reply('Invalid URL');
        } else {
          console.log(server);
          const url = await Url.findOne({ where: { server, url: value } });

          if (url !== null) {
            $.reply('URL already exists');
          } else {
            await Url.create({ server, url: value });

            $.reply('URL added');
          }
        }
      }
    } catch (ex) {
      console.error(ex);

      $.reply('Error, try again later');
    }
  }

  async remove($) {
    try {
      const args = $.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
      const value = args[1];

      if (value === undefined || value === null || value === '') {
        $.reply('ID must not be empty');
      } else {
        const url = await Url.findOne({ where: { id: value } });

        if (url === null) {
          $.reply('URL not found');
        } else {
          await url.destroy();

          $.reply('URL removed');
        }
      }
    } catch (ex) {
      console.error(ex);

      $.reply('Error, try again later');
    }
  }

  async list($) {
    try {
      const { channel } = $;
      const server = channel.guild.id;
      const urls = await Url.findAll({ where: { server } });

      if (urls === null || urls.length === 0) {
        $.reply('Use !izup add [URL] to add new URL');
      } else {
        urls.forEach(async (e) => {
          const embed = new RichEmbed().setTitle('').setColor().setDescription(`${e.id} - ${e.url}`);

          request(e.url, (error) => {
            console.log(e.url);
            embed.setTitle(`${error ? 'Offline' : 'Online'}`);
            embed.setColor(`${error ? 'RED' : 'GREEN'}`);

            channel.send(embed);
          });
        });
      }
    } catch (ex) {
      console.error(ex);

      $.reply('Error, try again later');
    }
  }

  async check($) {
    try {
      const args = $.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
      const value = args[1];

      if (value === undefined || value === null || value === '') {
        $.reply('URL must not be empty');
      } else {
        const validUrl = await ehUrl(value);

        if (!validUrl) {
          $.reply('Invalid URL');
        } else {
          request(value, (error) => {
            if (error) {
              $.reply(`${value} is offline!`);
            } else {
              $.reply(`${value} is online!`);
            }
          });
        }
      }
    } catch (ex) {
      console.error(ex);

      $.reply('Error, try again later');
    }
  }

  async checkChanges($) {
    try {
      const server = $.guild.id;
      const urls = await Url.findAll({ where: { server } });

      urls.forEach(async (e) => {
        const embed = new RichEmbed().setTitle('').setColor().setDescription(`${e.id} - ${e.url}`);

        request(e.url, (error) => {
          embed.setTitle(`${error ? 'Offline' : 'Online'}`);
          embed.setColor(`${error ? 'RED' : 'GREEN'}`);

          if (error) {
            $.send(embed);
          }
        });
      });
    } catch (ex) {
      console.error(ex);

      $.reply('Error, try again later');
    }
  }

  async help($) {
    $.reply(`I can help you check servers.\n\nYou can control me by sending these commands:\n\n${discordConfig.prefix} add [URL] - Add URL\n${discordConfig.prefix} remove [ID] - Remove URL\n${discordConfig.prefix} check [URL] - Check URL\n${discordConfig.prefix} list - List servers`);
  }
}

module.exports = UrlService;
