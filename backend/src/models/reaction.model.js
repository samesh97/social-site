const { DataTypes } = require("sequelize");
const { sequelize } = require("../conf/database.conf");
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
});

const sync = async () => {
  Post.hasMany(Reaction, { foreignKey: { name: 'postId' }, sourceKey: ['id'] });
  Reaction.belongsTo(User, { foreignKey: { name: 'userId'}, sourceKey: ['id']});
  await Reaction.sync();
};
sync();

module.exports = { Reaction, ReactonType };