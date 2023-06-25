const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('oracle://system:12345@localhost:1521/XE', { logging: false });

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