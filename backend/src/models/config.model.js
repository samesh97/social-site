const { DataTypes, UUIDV1 } = require('sequelize');
const  { sequelize } = require('../conf/database.conf');
const { config } = require('../conf/common.conf');
const { getCurrentDateTime } = require("../utils/common.util");

const ConfigKey = {
    REST_AUTH_BYPASS_URL: 'REST_AUTH_BYPASS_URL',
    ENABLE_CORS: 'ENABLE_CORS'
}

const Config = sequelize.define('Config', {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV1
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
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
const syncAndInsert = async () =>
{
    await Config.sync();
    const date = new Date().toISOString();
    await Config.create({
        name: ConfigKey.REST_AUTH_BYPASS_URL,
        value: config.REST_AUTH_BYPASS_URL,
        createdAt: date,
        updatedAt: date
    });
    await Config.create({
      name: ConfigKey.ENABLE_CORS,
      value: JSON.stringify( config.CORS_CONFIG ),
      createdAt: date,
      updatedAt: date
    });
}
syncAndInsert();
module.exports = { Config, ConfigKey };