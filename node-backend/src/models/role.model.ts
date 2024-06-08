import { DataTypes, Model, UUIDV1 } from "sequelize";
import { sequelize } from "../conf/database.conf";
import { getCurrentDateTime } from "../utils/common.util";
import { getLogger } from "../conf/logger.conf";
import { config } from "../conf/common.conf";

const Roles = {
  ADMIN: "ADMIN",
  USER: "USER",
};

class Role extends Model
{
  declare id: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV1
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
  },
  {
    tableName: 'Role',
    sequelize
});

const setAssociations = async () =>
{
  try
  {
    await Role.sync(config.DATABASE_MODE);
    await Role.create({
      createdAt: getCurrentDateTime(),
      updatedAt: getCurrentDateTime(),
      name: Roles.ADMIN
    });
    await Role.create({
      createdAt: getCurrentDateTime(),
      updatedAt: getCurrentDateTime(),
      name: Roles.USER
    });
  }
  catch (e)
  {
      getLogger().error("Error occured in role model " + e);
  }
};

setAssociations();

export {
  Role,
  Roles
}
