const { DataTypes, UUIDV1 } = require("sequelize");
const { sequelize } = require("../conf/database.conf");
const { User } = require("./user.model");
const { Post } = require('./post.model');

const Comment = sequelize.define("Comment", {
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
    }
});

const sync = async () =>
{
    // Comment.belongsTo(User);
    // Comment.belongsTo(Post);
    Post.hasMany(Comment, { foreignKey: { name: 'postId' }, sourceKey: ['id'] });
    Comment.belongsTo(User, { foreignKey: { name: 'userId'}, sourceKey: ['id']});
    await Comment.sync();
};
sync();

module.exports = { Comment };
