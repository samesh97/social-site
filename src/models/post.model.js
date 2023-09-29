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

const Reaction = sequelize.define("Reaction", {
  type: {
    type: DataTypes.STRING,
    defaultValue: "LIKE",
  },
});

const sync = async () => {
  Post.belongsTo(User);
  User.hasMany(Post);
  Post.hasMany(Reaction);
  Reaction.belongsTo(User);
  await Post.sync({ alter: true });
  await Reaction.sync({ alter: true });
};
sync();

module.exports = { Post, Reaction };
