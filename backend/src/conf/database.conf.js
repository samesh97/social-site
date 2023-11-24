const { Sequelize } = require('sequelize');
const { config } = require('./common.conf');
const { getLogger } = require('./logger.conf');

//database wide options
var opts = {
    define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true,
        
    },
    logging: false
}
const sequelize = new Sequelize( config.ORACLE_DB_CONNECTION_STR, opts );

const connectToDB = async () => {
    try
    {
        sequelize.authenticate();
        getLogger().info("Database connection success!");
    }
    catch (error)
    {
        getLogger().error(error, 'Error occured while connecting to database!');
    }
}
connectToDB();
module.exports = { sequelize };