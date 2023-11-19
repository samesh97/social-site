const { DataTypes, UUIDV1 } = require("sequelize");
const { sequelize } = require("../conf/database.conf");
const { Post } = require('./post.model');


const PostImage = sequelize.define("PostImage", {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV1
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const sync = async () =>
{
    Post.hasMany(PostImage, { foreignKey: { name: 'postId' }, sourceKey: ['id'] });
    PostImage.belongsTo(Post);
    await PostImage.sync();
};
sync();

module.exports = { PostImage };