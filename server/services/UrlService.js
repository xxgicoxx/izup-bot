const { MessageEmbed } = require('discord.js');
const EhUrl = require('eh-url');
const fetch = require('node-fetch');

const { Url } = require('../models');
const { discordConfig } = require('../configs');
const { constants } = require('../utils');

const ehUrl = new EhUrl();
class UrlService {
  async handle(message) {
    try {
      message.reply(constants.MESSAGE_COMMAND_NOT_FOUND);
    } catch (error) {
      console.error(error);

      message.reply(constants.MESSAGE_ERROR_TRY_AGAIN);
    }
  }

  async ready() {
    try {
      console.log(constants.MESSAGE_DISCORD_BOT_ONLINE);
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

      if (this.isEmpty(value)) {
        message.reply(constants.MESSAGE_URL_MUST_NOT_BE_EMPTY);

        return;
      }

      const validUrl = await ehUrl.check(value);

      if (!validUrl) {
        message.reply(constants.MESSAGE_URL_INVALID);

        return;
      }

      const url = await Url.findOne({ where: { guild, url: value } });

      if (url !== null) {
        message.reply(constants.MESSAGE_URL_ALREADY_EXISTS);

        return;
      }

      await Url.create({ guild, url: value });

      message.reply(constants.MESSAGE_URL_ADDED);
    } catch (error) {
      console.error(error);

      message.reply(constants.MESSAGE_ERROR_TRY_AGAIN);
    }
  }

  async remove(message) {
    try {
      const args = message.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
      const value = args[1];

      if (this.isEmpty(value)) {
        message.reply(constants.MESSAGE_ID_MUST_NOT_BE_EMPTY);

        return;
      }

      const url = await Url.findOne({ where: { id: value } });

      if (url === null) {
        message.reply(constants.MESSAGE_URL_NOT_FOUND);

        return;
      }

      await url.destroy();

      message.reply(constants.MESSAGE_URL_REMOVED);
    } catch (error) {
      console.error(error);

      message.reply(constants.MESSAGE_ERROR_TRY_AGAIN);
    }
  }

  async list(message) {
    try {
      const { channel } = message;
      const guild = channel.guild.id;
      const urls = await Url.findAll({ where: { guild } });

      if (this.isEmpty(urls)) {
        message.reply(constants.MESSAGE_URL_LIST_ARE_EMPTY);

        return;
      }

      urls.forEach((url) => {
        fetch(url.url)
          .then(() => {
            channel.send({ embeds: [new MessageEmbed().setTitle(constants.ONLINE).setColor(constants.GREEN).setDescription(`${url.id} - ${url.url}`)] });
          })
          .catch(() => {
            channel.send({ embeds: [new MessageEmbed().setTitle(constants.OFFLINE).setColor(constants.RED).setDescription(`${url.id} - ${url.url}`)] });
          });
      });
    } catch (error) {
      console.error(error);

      message.reply(constants.MESSAGE_ERROR_TRY_AGAIN);
    }
  }

  async check(message) {
    try {
      const args = message.content.slice(discordConfig.prefix.length).trim().split(/ +/g);
      const url = args[1];

      if (this.isEmpty(url)) {
        message.reply(constants.MESSAGE_URL_MUST_NOT_BE_EMPTY);

        return;
      }

      const validUrl = await ehUrl.check(url);

      if (!validUrl) {
        message.reply(constants.MESSAGE_URL_INVALID);

        return;
      }

      fetch(url).then(() => {
        message.reply(`${url} is ${constants.ONLINE}!`);
      }).catch(() => {
        message.reply(`${url} is ${constants.OFFLINE}!`);
      });
    } catch (error) {
      console.error(error);

      message.reply(constants.MESSAGE_ERROR_TRY_AGAIN);
    }
  }

  async jobs(channel) {
    try {
      const guild = channel.guild.id;
      const urls = await Url.findAll({ where: { guild } });

      urls.forEach((url) => {
        fetch(url.url).catch(() => {
          channel.send({ embeds: [new MessageEmbed().setTitle(constants.OFFLINE).setColor(constants.RED).setDescription(`${url.id} - ${url.url}`)] });
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  isEmpty(value) {
    return value === undefined || value === null || value === '' || value.length === 0;
  }
}

module.exports = UrlService;
