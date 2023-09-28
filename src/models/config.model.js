const { DataTypes, UUIDV1 } = require('sequelize');
const  { sequelize } = require('../configurations/database.conf');

const ConfigKey = {
    REST_AUTH_BYPASS_URL: 'REST_AUTH_BYPASS_URL',
    ENABLE_CORS: 'ENABLE_CORS'
}

const corsObject = {
    origin: ["http://localhost:4200"],
    methods: ["*"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true
};

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
    await Config.create({
      name: ConfigKey.ENABLE_CORS,
      value: JSON.stringify( corsObject )
    });
}
syncAndInsert();
module.exports = { Config, ConfigKey };