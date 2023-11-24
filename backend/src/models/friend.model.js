const { DataTypes } = require("sequelize");
const { sequelize } = require("../conf/database.conf");
const { User } = require("../models/user.model");

const Friend = sequelize.define("Friend", {
  firstUserId: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false,
  },
  secondUserId: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false,
  },
  score: {
    type: DataTypes.NUMBER,
    defaultValue: 100
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
  }
});

const sync = async () =>
{
  User.hasMany(Friend, { foreignKey: { name: 'firstUserId' }, sourceKey: ['id'] });
  User.hasMany(Friend, { foreignKey: { name: 'secondUserId'}, sourceKey: ['id']});
  await Friend.sync();
};

sync();
module.exports = { Friend };
