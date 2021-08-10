module.exports = (sequelize, DataTypes) => {
  const Url = sequelize.define('Url', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    guild: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING(2000),
    },
  },
  {
    tableName: 'urls',
    timestamps: false,
  });

  return Url;
};
