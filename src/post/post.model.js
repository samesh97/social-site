const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../database');

const Post = sequelize.define('post', {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    topic: DataTypes.STRING
});

Post.sync();

module.exports = { Post };

