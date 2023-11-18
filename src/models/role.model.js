const { DataTypes, UUIDV1 } = require("sequelize");
const { sequelize } = require("../conf/database.conf");

const Role = sequelize.define("Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV1,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
);

const Roles = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const sync = async () =>
{
  await Role.sync();
  await Role.findOrCreate({
    where: {
      name: Roles.ADMIN,
    },
  });
  await Role.findOrCreate({
    where: {
      name: Roles.USER,
    },
  });
};

sync();

module.exports = { Role, Roles };
