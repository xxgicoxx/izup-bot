const discord = {
  token: process.env.IZUP_DISCORD_TOKEN || '',
  prefix: process.env.IZUP_PREFIX || '!izup',
};

module.exports = discord;
