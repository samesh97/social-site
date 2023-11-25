const { DataTypes } = require("sequelize");
const { sequelize } = require("../conf/database.conf");
const { User } = require("../models/user.model");

const Friend = sequelize.define("Friend", {
  requestedUser: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false,
  },
  acceptedUser: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false,
  },
  isAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  User.hasMany(Friend, { foreignKey: { name: 'requestedUser' }, sourceKey: ['id'] });
  User.hasMany(Friend, { foreignKey: { name: 'acceptedUser'}, sourceKey: ['id']});
  await Friend.sync();
};

sync();
module.exports = { Friend };
