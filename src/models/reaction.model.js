const { DataTypes } = require("sequelize");
const { sequelize } = require("../configurations/database.conf");
const { Post } = require('./post.model');
const { User } = require("./user.model");

const ReactonType = {
  LIKE: 'LIKE',
  HAHA: 'HAHA',
  ANGRY: 'ANGRY',
  WOW: 'WOW',
  SAD: 'SAD'
}

const Reaction = sequelize.define("Reaction", {
  type: {
    type: DataTypes.STRING,
    defaultValue: ReactonType.LIKE,
    allowNull: false
  }
});

const sync = async () => {
  Post.hasMany(Reaction);
  Reaction.belongsTo(User);
  await Reaction.sync({ alter: true });
};
sync();

module.exports = { Reaction, ReactonType };