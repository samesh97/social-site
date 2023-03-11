const { DataTypes, UUIDV4 } = require('sequelize');
const { sequelize } = require('../database');
const { Role } = require('../role/role.model');

const User = sequelize.define('User', {
    id: {
        primaryKey: true,
        type: DataTypes.UUIDV4,
        defaultValue: UUIDV4
    },
    firstName: DataTypes.STRING,
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    password: DataTypes.STRING,
});

const User_Role = sequelize.define(
    "User_Role",
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUIDV4,
            defaultValue: UUIDV4
        }
    },
    { timestamps: false }
);

const sync = async () => {
    User.hasMany(User_Role);
    User.belongsToMany(Role, { through: 'User_Role' });
    await User_Role.sync();
    await User.sync();
}
sync();
module.exports = { User, User_Role };