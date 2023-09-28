const { Sequelize } = require('sequelize');
const { config } = require('./common.conf');

const sequelize = new Sequelize( config.ORACLE_DB_CONNECTION_STR, { logging: false } );

const connectToDB = async () => {
    try {
        sequelize.authenticate();
        console.log('Database connection is success');
    }
    catch( error ) {
        console.log(`Error occured while connecting to database ${error}`);
    }
}
connectToDB();
module.exports = { sequelize };