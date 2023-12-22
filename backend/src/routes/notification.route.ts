import { Request, Response, Router } from "express";
import { response, isNullOrEmpty, getSessionInfo, getCurrentDateTime } from "../utils/common.util";
import { getLogger } from "../conf/logger.conf";

const notificationRoute = Router();

notificationRoute.get('/', async (req: Request, res: Response) => {
    const { userId } = getSessionInfo(req);
    try
    {
        if (isNullOrEmpty(userId))
        {
            return response(res, "Bad request", 400);    
        }
    }
    catch (e)
    {
        getLogger().error(`Error while loading user (${userId}) notification -> ${e}`);
    }
});

export {
    notificationRoute
}

