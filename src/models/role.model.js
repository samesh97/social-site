const { DataTypes, UUIDV1 } = require("sequelize");
const { sequelize } = require("../conf/database.conf");

const Role = sequelize.define("Role",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV1,
    },
    name: DataTypes.STRING,
  },
  { timestamps: false }
);

const Roles = {
  ADMIN: "ADMIN",
  USER: "USER",
};

const sync = async () => {
  await Role.sync();
  const admin = await Role.findOrCreate({
    where: {
      name: Roles.ADMIN,
    },
  });
  const user = await Role.findOrCreate({
    where: {
      name: Roles.USER,
    },
  });
};
sync();

module.exports = { Role, Roles };
