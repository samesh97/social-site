const { UUID, UUIDV1, DataTypes } = require('sequelize');
const { sequelize } = require('../conf/database');


const TokenType = {
    ACCESS_TOKEN: "ACCESS",
    REFRESH_TOKEN: "REFRESH"
}

const TokenStatus = {
    WHITELISTED: "ALLOWED",
    BLACKLISTED: "BLOCKED"
}

const Token = sequelize.define('Token', {
    id: {
        type: UUID,
        defaultValue: UUIDV1,
        primaryKey: true
    },
    userId: {
        type: UUID,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const sync = async () => {
    Token.sync({ alter: true });
}
sync();

module.exports = { TokenType, TokenStatus, Token };