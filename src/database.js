const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:', { logging: false });

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