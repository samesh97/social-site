const { DataTypes } = require('sequelize');
const  { sequelize } = require('../database');
const User = require('../user/user.model');

const Role = sequelize.define('Role', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: DataTypes.STRING
});

Role.associations = (models) => {
    Role.belongsToMany(User, { through: 'User_Role' });
}

const Roles = {
    ADMIN: "ADMIN",
    USER: "USER"
}

const syncAndInsert = async () => {
    await Role.sync();
    await Role.create({
        id: 1,
        name: 'USER'
    });
    await Role.create({
        id: 2,
        name: 'ADMIN'
    });
}
syncAndInsert();
module.exports = { Role, Roles };