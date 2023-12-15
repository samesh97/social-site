import { DataTypes, Model, UUIDV1 } from "sequelize";
import { sequelize } from "../conf/database.conf";
import { User } from "./user.model";
import { Post } from './post.model';
import { getLogger } from "../conf/logger.conf";
import { config } from "../conf/common.conf";

class Comment extends Model
{
    declare id: string;
    declare comment: string;
    declare userId: string;
    declare postId: string;
    declare createdAt: Date;
    declare updatedAt: Date
}

Comment.init(
{
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV1
    },
    comment: {
        type: DataTypes.STRING(1000),
        allowNull: false
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
    tableName: 'Comment',
    sequelize
},
);

const sync = async () =>
{
    try
    {
        Post.hasMany(Comment, { foreignKey: { name: 'postId' }, sourceKey: 'id' });
        User.hasMany(Comment, { foreignKey: { name: 'userId' }, sourceKey: 'id' });
        Comment.belongsTo(User, { foreignKey: { name: 'userId'}});
        await Comment.sync(config.DATABASE_MODE);
    }
    catch (e)
    {
        getLogger().error("Error occured in comment model " + e);
    }
};
sync();

export { Comment };
