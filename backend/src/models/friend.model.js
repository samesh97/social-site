const { DataTypes } = require("sequelize");
const { sequelize } = require("../conf/database.conf");

const Friend = sequelize.define("Friend", {
  firstUser: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false,
  },
  secondUser: {
    primaryKey: true,
    type: DataTypes.UUID,
    allowNull: false,
  },
});

exports.module = { Friend };
