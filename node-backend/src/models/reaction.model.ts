import { Model } from "sequelize";
import { config } from "../conf/common.conf";
import { getLogger } from "../conf/logger.conf";

import { DataTypes } from "sequelize";
import { sequelize } from "../conf/database.conf";
import { Post } from './post.model';
import { User } from "./user.model";

const ReactonType = {
  LIKE: 'LIKE',
  HAHA: 'HAHA',
  ANGRY: 'ANGRY',
  WOW: 'WOW',
  SAD: 'SAD'
}

class Reaction extends Model
{
  declare type: string;  
  declare userId: string;
  declare postId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Reaction.init(
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    postId: {
      type: DataTypes.UUID,
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
    tableName: 'Reaction',
    sequelize
  }
);

const setAssociations = async () => {
  try
  {
    Post.hasMany(Reaction, { foreignKey: { name: 'postId' }, sourceKey: 'id' });
    User.hasMany( Reaction, { foreignKey: { name: 'userId'}, sourceKey: 'id'})
    Reaction.belongsTo(User, { foreignKey: { name: 'userId'}});
    await Reaction.sync(config.DATABASE_MODE);
  }
  catch (e)
  {
      getLogger().error("Error occured in reaction model " + e);
  }
};
setAssociations();

export { Reaction, ReactonType };