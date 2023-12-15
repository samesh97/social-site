import { Model } from "sequelize";

import { DataTypes } from "sequelize";
import { sequelize } from "../conf/database.conf";
import { User } from "../models/user.model";
import { getLogger } from "../conf/logger.conf";
import { config } from "../conf/common.conf";

class Friend extends Model
{
  declare requestedUser: string;
  declare acceptedUser: string;
  declare isAccepted: boolean;
  declare score: number;
  declare createdAt: Date;
  declare updatedAt: Date;

}

Friend.init(
{
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
},
{
  tableName: 'Friend',
  sequelize
}
);

const setAssociations = async () =>
{
  try
    {
      User.hasMany(Friend, { foreignKey: { name: 'requestedUser' }, sourceKey: 'id' });
      User.hasMany(Friend, { foreignKey: { name: 'acceptedUser'}, sourceKey: 'id'});
      await Friend.sync(config.DATABASE_MODE);
    }
    catch (e)
    {
        getLogger().error("Error occured in friend model " + e);
    }
};

setAssociations();
export { Friend };
