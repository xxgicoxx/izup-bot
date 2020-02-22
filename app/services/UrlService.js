const { RichEmbed } = require('discord.js');
const ehUrl = require('eh-url');
const request = require('request');

const { Url } = require('../models');

const { discordConfig } = require('../configs');

class UrlService {
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
        urls.forEach((e) => {
          const embed = new RichEmbed().setTitle('').setColor().setDescription(`${e.id} - ${e.url}`);

          request(e.url, (error) => {
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
            $.reply(`${value} is ${error ? 'Offline' : 'Online'}!`);
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

      urls.forEach((e) => {
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
    }
  }
}

module.exports = UrlService;
