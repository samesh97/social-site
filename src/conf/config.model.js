const { DataTypes, UUIDV1 } = require('sequelize');
const  { sequelize } = require('../database');

const Config = sequelize.define('Config', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV1
    },
    name: DataTypes.STRING,
    value: DataTypes.STRING
});
const syncAndInsert = async () => {
    await Config.sync({ force: true });
    await Config.create({
        name: 'REST_AUTH_BYPASS_URL',
        value: '/users,/auth'
    });
}
syncAndInsert();
module.exports = { Config };