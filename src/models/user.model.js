const { DataTypes } = require("sequelize");
const { sequelize } = require("../conf/database.conf");
const { Role } = require("./role.model");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
});

const sync = async () =>
{
  User.belongsTo(Role, { foreignKey: { name: 'roleId' }, sourceKey: ['id'] });
  await User.sync();
};

sync();

module.exports = { User };
