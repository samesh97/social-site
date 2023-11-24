const { Router } = require("express");
const { isNullOrEmpty, response, getCurrentDateTime } = require("../utils/common.util");
const { User } = require("../models/user.model");
const { Friend } = require("../models/friend.model");
const { getLogger } = require("../conf/logger.conf");

const friendRoute = Router();

friendRoute.post('/', async (req, res) =>
{
    try
    {
        const { firstUserId, secondUserId } = req.body;
        if (isNullOrEmpty(firstUserId, secondUserId))
        {
            return response(res, "No valid userIds found!", 400);    
        }

        const user1 = await User.findByPk(firstUserId);
        const user2 = await User.findByPk(secondUserId);
        if (isNullOrEmpty(user1, user2))
        {
            return response(res, "No users found in the database!", 400);    
        }
        const time = getCurrentDateTime();
        await Friend.create({
            firstUserId: user1.id,
            secondUserId: user2.id,
            createdAt: time,
            updatedAt: time
        });
        return response(res, "Added friend!", 200);
    }
    catch (error)
    {
        getLogger().error(error);
        return response(res, "Failed to add friend!", 500);
    }
});

module.exports = { friendRoute };