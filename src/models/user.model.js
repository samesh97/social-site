const { DataTypes } = require("sequelize");
const { sequelize } = require("../configurations/database.conf");
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
  },
});

const User_Role = sequelize.define("User_Role", {}, { timestamps: false });

const sync = async () => {
  User.belongsToMany(Role, { through: User_Role });
  Role.belongsToMany(User, { through: User_Role });
  await User.sync();
  await User_Role.sync();
};
sync();
module.exports = { User, User_Role };
