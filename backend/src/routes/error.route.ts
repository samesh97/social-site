import { Request, Response, Router } from "express";
import { response } from "../utils/common.util";

const errorRoute = Router();

errorRoute.all('/', async (req: Request, res: Response) => {
    return response(res, "Requested URL not found.", 404);
});

export {
    errorRoute
}