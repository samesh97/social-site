import { Model } from "sequelize";
import { config } from "../conf/common.conf";
import { getLogger } from "../conf/logger.conf";

import { DataTypes, UUIDV1 } from "sequelize";
import { sequelize } from "../conf/database.conf";
import { Post } from './post.model';

class PostImage extends Model
{
    declare id: string;
    declare imageUrl: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}

PostImage.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: UUIDV1
        },
        imageUrl: {
            type: DataTypes.STRING(1000),
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
        tableName: 'PostImage',
        sequelize
    }
);


const setAssociations = async () =>
{
    try
    {
        Post.hasMany(PostImage, { foreignKey: { name: 'postId' }, sourceKey: 'id' });
        PostImage.belongsTo(Post);
        await PostImage.sync(config.DATABASE_MODE);
    }
    catch (e)
    {
        getLogger().error("Error occured in post-image model " + e);
    }
};
setAssociations();

export { PostImage };