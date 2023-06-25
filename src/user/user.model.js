const { DataTypes, UUIDV1 } = require('sequelize');
const { sequelize } = require('../database');
const { Role } = require('../role/role.model');

const User = sequelize.define('User', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV1
    },
    firstName: DataTypes.STRING,
    username: {
        type: DataTypes.STRING
    },
    password: DataTypes.STRING,
});

const User_Role = sequelize.define('User_Role',
    {},
    { timestamps: false }
);

const sync = async () => {
    User.belongsToMany(Role,  { through: User_Role });
    Role.belongsToMany(User,  { through: User_Role });
    await User.sync( { force: true });
    await User_Role.sync( { force: true });
}
sync();
module.exports = { User, User_Role };