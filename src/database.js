const { Sequelize } = require('sequelize');

const dbConStr = process.env.ORACLE_DB_CONNECTION_STR;
const sequelize = new Sequelize(dbConStr, { logging: false });

const connectToDB = async () => {
    try {
        sequelize.authenticate();
        console.log('Database connection is success');
    }
    catch(error) {
        console.log(`Error occured while connecting to database ${error}`);
    }
}
connectToDB();
module.exports = { sequelize };