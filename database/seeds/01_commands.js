const { discordConfig } = require('../../server/configs');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('commands', [
    { command: `${discordConfig.prefix} add {url}`, description: 'Add URL' },
    { command: `${discordConfig.prefix} remove {id}`, description: 'Remove URL' },
    { command: `${discordConfig.prefix} check {url}`, description: 'Check URL' },
    { command: `${discordConfig.prefix} list`, description: 'List servers' },
    { command: `${discordConfig.prefix} help`, description: 'Help' },
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('commands', null, {}),
};
