const { MessageEmbed } = require('discord.js');
const ehUrl = require('eh-url');
const fetch = require('node-fetch');

const { Url } = require('../models');

const { discordConfig } = require('../configs');

class UrlService {
  async handle(message) {
    try {
      message.reply('Command not found');
    } catch (error) {
      console.error(error);

      message.reply('Error, try again later');
    }
  }

  async ready() {
    try {
      console.log('Discord bot online!');
    } catch (error) {
      console.error(error);
    }
  }

  async add(message) {
    try {
      const { channel } = message;
      const args = message.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
      const value = args[1];
      const guild = channel.guild.id;

      if (value === '') {
        message.reply('URL must not be empty');
      } else {
        const validUrl = await ehUrl(value);

        if (!validUrl) {
          message.reply('Invalid URL');
        } else {
          const url = await Url.findOne({ where: { guild, url: value } });

          if (url !== null) {
            message.reply('URL already exists');
          } else {
            await Url.create({ guild, url: value });

            message.reply('URL added');
          }
        }
      }
    } catch (error) {
      console.error(error);

      message.reply('Error, try again later');
    }
  }

  async remove(message) {
    try {
      const args = message.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
      const value = args[1];

      if (value === undefined || value === null || value === '') {
        message.reply('ID must not be empty');
      } else {
        const url = await Url.findOne({ where: { id: value } });

        if (url === null) {
          message.reply('URL not found');
        } else {
          await url.destroy();

          message.reply('URL removed');
        }
      }
    } catch (error) {
      console.error(error);

      message.reply('Error, try again later');
    }
  }

  async list(message) {
    try {
      const { channel } = message;
      const guild = channel.guild.id;
      const urls = await Url.findAll({ where: { guild } });

      if (urls === null || urls.length === 0) {
        message.reply('Use !izup add [URL] to add new URL');
      } else {
        urls.forEach((url) => {
          fetch(url.url)
            .then(() => {
              channel.send({ embeds: [new MessageEmbed().setTitle('Online').setColor('GREEN').setDescription(`${url.id} - ${url.url}`)] });
            })
            .catch(() => {
              channel.send({ embeds: [new MessageEmbed().setTitle('Offline').setColor('RED').setDescription(`${url.id} - ${url.url}`)] });
            });
        });
      }
    } catch (error) {
      console.error(error);

      message.reply('Error, try again later');
    }
  }

  async check(message) {
    try {
      const args = message.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
      const url = args[1];

      if (url === undefined || url === null || url === '') {
        message.reply('URL must not be empty');
      } else {
        const validUrl = await ehUrl(url);

        if (!validUrl) {
          message.reply('Invalid URL');
        } else {
          fetch(url)
            .then(() => {
              message.reply(`${url} is Online!`);
            })
            .catch(() => {
              message.reply(`${url} is Offline!`);
            });
        }
      }
    } catch (error) {
      console.error(error);

      message.reply('Error, try again later');
    }
  }

  async jobs(channel) {
    try {
      const guild = channel.guild.id;
      const urls = await Url.findAll({ where: { guild } });

      urls.forEach((url) => {
        fetch(url.url)
          .catch(() => {
            channel.send({ embeds: [new MessageEmbed().setTitle('Offline').setColor('RED').setDescription(`${url.id} - ${url.url}`)] });
          });
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = UrlService;
