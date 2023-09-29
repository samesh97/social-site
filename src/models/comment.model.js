const { DataTypes, UUIDV1 } = require("sequelize");
const { sequelize } = require("../configurations/database.conf");
const { User } = require("./user.model");
const { Post } = require('./post.model');

const Comment = sequelize.define("Comment", {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV1
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const sync = async () => {
    Comment.belongsTo(User);
    Post.hasMany(Comment);
    await Comment.sync({ alter: true });
};
sync();

module.exports = { Comment };
