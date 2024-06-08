import { DataTypes, Model, UUIDV1 } from 'sequelize';
import  { sequelize } from '../conf/database.conf';
import { config } from '../conf/common.conf';
import { getCurrentDateTime } from "../utils/common.util";
import { getLogger } from '../conf/logger.conf';

const ConfigKey = {
    REST_AUTH_BYPASS_URL: 'REST_AUTH_BYPASS_URL',
    ENABLE_CORS: 'ENABLE_CORS'
}

class Config extends Model
{
    declare id: string;
    declare name: string;
    declare value: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Config.init(
{
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV1
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
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
},
{
    tableName: 'Config',
    sequelize
}
);

const syncAndInsert = async () =>
{
    try
    {
        await Config.sync(config.DATABASE_MODE);
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
    catch (e)
    {
        getLogger().error("Error occured in config model " + e);
    }
}
syncAndInsert();
export { Config, ConfigKey };