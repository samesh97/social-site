import { Model } from "sequelize";
import { config } from "../conf/common.conf";
import { getLogger } from "../conf/logger.conf";

import { UUID, UUIDV1, DataTypes } from 'sequelize';
import { sequelize } from '../conf/database.conf';


const TokenType = {
    ACCESS_TOKEN: "ACCESS",
    REFRESH_TOKEN: "REFRESH"
}

const TokenStatus = {
    WHITELISTED: "ALLOWED",
    BLACKLISTED: "BLOCKED"
}

class Token extends Model
{
    declare id: string;  
    declare userId: string;
    declare type: string;
    declare status: string;
    declare token: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Token.init(
    {
        id: {
            type: UUID,
            defaultValue: UUIDV1,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
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
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: 'Token',
        sequelize
    }
);

const sync = async () => {
  try
  {
    Token.sync(config.DATABASE_MODE);
  }
  catch (e)
  {
      getLogger().error("Error occured in token model " + e);
  }
}
sync();

export { TokenType, TokenStatus, Token };