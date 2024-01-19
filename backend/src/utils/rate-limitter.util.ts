import { NextFunction, Request, Response } from "express";
import { getLogger } from "../conf/logger.conf";

const ipLimitter = (req: Request, res: Response, next: NextFunction) =>
{
    const ip = req.ip;
    next();
}
export {
    ipLimitter
}