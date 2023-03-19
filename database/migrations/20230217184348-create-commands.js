module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('commands', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    command: {
      allowNull: false,
      type: DataTypes.STRING(2000),
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING(2000),
    },
  }, {
    tableName: 'commands',
    timestamps: false,
  }),

  down: (queryInterface) => queryInterface.dropTable('commands'),
};
