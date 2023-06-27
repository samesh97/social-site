const { DataTypes, UUIDV1 } = require('sequelize');
const  { sequelize } = require('./database');

const ConfigKey = {
    REST_AUTH_BYPASS_URL: 'REST_AUTH_BYPASS_URL'
}

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
    await Config.sync({ alter: true });
    await Config.create({
        name: ConfigKey.REST_AUTH_BYPASS_URL,
        value:'/users,/auth/*'
    });
}
syncAndInsert();
module.exports = { Config, ConfigKey };