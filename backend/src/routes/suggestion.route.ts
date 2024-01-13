import { Request, Response, Router } from "express";
import { User } from "../models/user.model";
import { getLogger } from "../conf/logger.conf";
import { response } from "../utils/common.util";

const suggestionRouter = Router();

suggestionRouter.get('/', async (req: Request, res: Response) =>
{
    try
    {
        const users = await User.findAll();
        return response(res, users, 200);
    }
    catch (e)
    {
        getLogger().error(e);
        return response(res, "Server side error occured", 500);
    }
});


export
{
    suggestionRouter
}

