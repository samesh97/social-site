import { Request, Response, Router } from "express";
import { response, isNullOrEmpty, getSessionInfo, getCurrentDateTime } from "../utils/common.util";
import { getLogger } from "../conf/logger.conf";
import { getUserNotifications } from "../utils/db-query.util";

const notificationRoute = Router();

notificationRoute.get('/', async (req: Request, res: Response) =>
{
    try
    {
        const { userId } = getSessionInfo(req);
        if (isNullOrEmpty(userId))
        {
            return response(res, "Invalid session", 400);    
        }
        const notifications = await getUserNotifications(userId);
        return response(res, notifications, 200);
    }
    catch (e)
    {
        getLogger().error(e);
        return response(res, "Server side error occured", 500);
    }
});

export
{
    notificationRoute
}

