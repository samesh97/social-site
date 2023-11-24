const { DataTypes, UUIDV1 } = require("sequelize");
const { sequelize } = require("../conf/database.conf");
const { getCurrentDateTime } = require("../utils/common.util");

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
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
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
    createdAt: getCurrentDateTime(),
    updatedAt: getCurrentDateTime()
  });
  await Role.findOrCreate({
    where: {
      name: Roles.USER,
    },
    createdAt: getCurrentDateTime(),
    updatedAt: getCurrentDateTime()
  });
};

sync();

module.exports = { Role, Roles };
