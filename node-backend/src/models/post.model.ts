import { DataTypes, Model, UUIDV1 } from "sequelize";
import { sequelize } from "../conf/database.conf";
import { User } from "../models/user.model";
import { getLogger } from "../conf/logger.conf";
import { config } from "../conf/common.conf";

class Post extends Model
{
  declare id: string;
  declare description: string;
  declare createdAt: Date;
  declare updatedAt: Date
  declare UserId: string;
}
Post.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV1,
    },
    description: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      defaultValue: "",
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
    tableName: 'Post',
    sequelize
  },
);

const setAssociations = async () =>
{
  try
  {
    Post.belongsTo(User);
    User.hasMany(Post);
    await Post.sync(config.DATABASE_MODE);
  }
  catch (e)
  {
      getLogger().error("Error occured in post model " + e);
  }
};
setAssociations();

export { Post };
