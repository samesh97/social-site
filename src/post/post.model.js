const { DataTypes, UUIDV1 } = require('sequelize');
const { sequelize } = require('../database');

const Post = sequelize.define('Post', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV1
    },
    topic: DataTypes.STRING
});
Post.sync({ force: true });

module.exports = { Post };

