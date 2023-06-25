const { DataTypes, UUIDV1 } = require('sequelize');
const  { sequelize } = require('../database');
const User = require('../user/user.model');

const Role = sequelize.define('Role', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV1
    },
    name: DataTypes.STRING
}, { timestamps: false });

const Roles = {
    ADMIN: "ADMIN",
    USER: "USER"
}

const sync = async () => {
    await Role.sync( { force: true });
    const admin = await Role.findOrCreate
    (
        {
            where: 
            {
                name: Roles.ADMIN
            }
        }
    );
    console.log(admin);
    const user = await Role.findOrCreate
    (
       {
        where:  
        {
            name: Roles.USER
        }
       }
    );
    console.log(user);
}
sync();

module.exports = { Role, Roles };