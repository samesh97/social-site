import { DataTypes, Model, UUIDV1 } from "sequelize";
import { sequelize } from "../conf/database.conf";
import { User } from "./user.model";
import { getLogger } from "../conf/logger.conf";
import { config } from "../conf/common.conf";

class Notification extends Model
{
    declare id: string;
    declare type: string;
    declare initiatedUserId: string;
    declare targetUserId: string;
    declare hasSeen: boolean;
    declare targetId: string;
    declare targetType: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Notification.init(
{
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV1
    },
    type: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    initiatedUserId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    targetUserId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    targetId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    targetType: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    hasSeen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    tableName: 'Notification',
    sequelize
},
);

const sync = async () =>
{
    try
    {
        User.hasMany(Notification, { foreignKey: { name: 'initiatedUserId' }, sourceKey: 'id' });
        User.hasMany(Notification, { foreignKey: { name: 'targetUserId' }, sourceKey: 'id' });
        Notification.belongsTo(User, {as: 'initiatedUser', foreignKey: 'initiatedUserId'});
        Notification.belongsTo(User, {as: 'targetUser', foreignKey: 'targetUserId'});
        await Notification.sync(config.DATABASE_MODE);
    }
    catch (e)
    {
        getLogger().error("Error occured in notification model " + e);
    }
};
sync();

export { Notification };
