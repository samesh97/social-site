import { Request, Response, Router } from "express";
import { isNullOrEmpty, response, getCurrentDateTime, getSessionInfo } from "../utils/common.util";
import { User } from "../models/user.model";
import { Friend } from "../models/friend.model";
import { getLogger } from "../conf/logger.conf";
import { getFriendRequests, getFriendship } from "../utils/db-query.util";

const friendRoute = Router();

friendRoute.post('/', async (req, res) =>
{
    try
    {
        //requested user
        const { userId } = getSessionInfo(req);
        //the user request is sent to
        const { user } = req.body;

        if (isNullOrEmpty(user))
        {
            return response(res, "No valid user found", 400);    
        }

        const requestedUser = await User.findByPk(userId);
        const acceptedUser = await User.findByPk(user);
        if (isNullOrEmpty(requestedUser, acceptedUser))
        {
            return response(res, "No users found", 400);    
        }

        const time = getCurrentDateTime();

        const friendship = await getFriendship(requestedUser.id, acceptedUser.id);
        if (isNullOrEmpty(friendship))
        {
            //send friend request
            await Friend.create({
                requestedUserId: requestedUser.id,
                acceptedUserId: acceptedUser.id,
                createdAt: time,
                updatedAt: time
            });
        }
        else if (friendship.isAccepted || friendship.requestedUserId == userId)
        {
            //remove friend
            await friendship.destroy();
        }

        return response(res, "Success!", 200);
    }
    catch (error)
    {
        getLogger().error(error);
        return response(res, "Failed to add friend!", 500);
    }
});

friendRoute.post('/action', async (req: Request, res: Response) =>
{
    try
    {
        //accepting or denying user
        const { userId } = getSessionInfo(req);
        //the target friend to accept or deny
        const { user, isAccepted } = req.body;

        if (isNullOrEmpty(user, isAccepted))
        {
            return response(res, "Incomplete request", 400);    
        }

        const userInAction = await User.findByPk(userId);
        const targetUser = await User.findByPk(user);

        if (isNullOrEmpty(userInAction, targetUser))
        {
            return response(res, "No user found", 400);    
        }

        const friendship = await getFriendship(userInAction.id, targetUser.id);
        if (isNullOrEmpty(friendship))
        {
            return response(res, "No request found", 404);    
        }
        
        if (isAccepted)
        {
            await friendship.update({
                isAccepted: true,
                updatedAt: getCurrentDateTime()
            });
            return response(res, "Accepted.", 201);
        }
        await friendship.destroy();
        return response(res, "Declined.", 201);
    }
    catch (e)
    {
        getLogger().error(e);
        return response(res, "Server side error occured", 500);
    }
});

friendRoute.get('/requests', async (req: Request, res: Response) =>
{
    try
    {
        const { userId } = getSessionInfo(req);
        if (isNullOrEmpty(userId))
        {
            return response(res, "No user found", 401);    
        }

        const requests = await getFriendRequests(userId);
        return response(res, requests, 200);
    }
    catch (e)
    {
        getLogger().error(e);
        return response(res, "Server side error occured", 500);
    }
});

export
{
    friendRoute
}