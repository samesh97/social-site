import { DataTypes, Model, UUIDV1 } from "sequelize";
import { sequelize } from "../conf/database.conf";
import { Role } from "./role.model";
import { getLogger } from "../conf/logger.conf";
import { config } from "../conf/common.conf";

class User extends Model
{
  declare id: string;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare password: string;
  declare isVerified: boolean;
  declare profileUrl: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV1
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
    profileUrl: {
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
  },
  {
    tableName: 'User',
    sequelize
  },
);

const setAssociations = async () =>
{
  try
  {
    User.belongsTo(Role, { foreignKey: { name: 'roleId' }});
    await User.sync(config.DATABASE_MODE);
  }
  catch (e)
  {
      getLogger().error("Error occured in user model " + e);
  }
};

setAssociations();

export { User };
