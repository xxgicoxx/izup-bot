module.exports = (sequelize, DataTypes) => {
  const Command = sequelize.define('Command', {
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
  });

  return Command;
};
