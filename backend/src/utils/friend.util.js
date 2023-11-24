const { Friend } = require("../models/friend.model");
const { Op } = require('sequelize');
const { isNullOrEmpty } = require('./common.util');
const { getLogger } = require("../conf/logger.conf");


const changeScore = async (userId, score) =>
{
    const user = await Friend.findOne({
        where: {
            [Op.or]: [
                { firstUserId: userId },
                { secondUserId: userId }
            ]
        }
    });

    if (isNullOrEmpty(user))
    {
        getLogger().warn("No user found to increase the score!");
        return;    
    }
    user.update({ score: user.score + score });
    getLogger().info("Score added!");
}

module.exports = { changeScore };