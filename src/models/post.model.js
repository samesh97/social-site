const { DataTypes, UUIDV1 } = require("sequelize");
const { sequelize } = require("../configurations/database.conf");
const { User } = require("../models/user.model");

const Post = sequelize.define("Post", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: UUIDV1,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
});

const sync = async () => {
  Post.belongsTo(User);
  User.hasMany(Post);
  await Post.sync();
};
sync();

module.exports = { Post };
