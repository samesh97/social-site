import { Router } from "express";
import { isNullOrEmpty, response, getCurrentDateTime, getSessionInfo } from "../utils/common.util";
import { User } from "../models/user.model";
import { Friend } from "../models/friend.model";
import { getLogger } from "../conf/logger.conf";
import { getFriendship } from "../utils/db-query.util";

const friendRoute = Router();

friendRoute.post('/', async (req, res) =>
{
    try
    {
        const { userId } = getSessionInfo(req);
        const { user } = req.body;

        if (isNullOrEmpty(user))
        {
            return response(res, "No valid userIds found!", 400);    
        }

        const requestedUser = await User.findByPk(userId);
        const acceptedUser = await User.findByPk(user);
        if (isNullOrEmpty(requestedUser, acceptedUser))
        {
            return response(res, "No users found in the database!", 400);    
        }
        const time = getCurrentDateTime();

        const friendship = await getFriendship(requestedUser.id, acceptedUser.id);
        if (isNullOrEmpty(friendship))
        {
            //send friend request
            await Friend.create({
                requestedUser: requestedUser.id,
                acceptedUser: acceptedUser.id,
                createdAt: time,
                updatedAt: time
            });
        }
        else if (friendship.isAccepted)
        {
            //remove friend
            await friendship.destroy();
        }
        else if (friendship.requestedUser == userId)
        {
            //delete friend request
            await friendship.destroy();
        }
        else if (friendship.acceptedUser == userId)
        {
            //accept friend request
            await friendship.update({
                isAccepted: true
            });
        }

        return response(res, "Success!", 200);
    }
    catch (error)
    {
        getLogger().error(error);
        return response(res, "Failed to add friend!", 500);
    }
});

export {
    friendRoute
}