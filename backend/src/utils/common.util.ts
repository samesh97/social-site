import { getLogger } from "../conf/logger.conf";
import { Response } from "../dtos/response.dto";
import { Config } from "../models/config.model";
import { Response  as ResponseExpress, Request }  from "express";
import bcrypt from "bcrypt";

const isNullOrEmpty = (...values: any []) =>
{
    const result = values.some(value => value == undefined || value == null);
    if (result)
    {
        getLogger().error("Values is null or empty");
    }
    return result;
}

const isNotNullOrEmpty = (...values: any[]) => 
{
    const result = values.some(value => value != undefined && value != null);
    return result;
}

const minutesToMilliseconds = (minutes: number) => 
{
    if (isNullOrEmpty(minutes))
    {
        return 0;
    }
    return minutes * 1000 * 60;
}

const response = (res: ResponseExpress, data: any, code: number) =>
{
    const response = new Response();
    response.code = code;
    response.data = data;
    return res.status(code).json(response);
};

const sliceEnd = (text: string, endChar: string) => 
{
    if (!text || !endChar)
    {
        return "";    
    }
    return text.endsWith(endChar) ? text.substring(0, text.length - 1): text;
}

const getConfig = async (name: string) =>
{
    const config: any = await Config.findOne({
        where: { name: name },
    });
    return config?.value;
}

const getSessionInfo = (req: Request) => 
{
    const data = req.body.session;
    return data ? data : {};
}
const setSessionInfo = (req: Request, data: any) => 
{
    req.body.session = data;
}

const textTohash = (text: string, saltRounds: number) => 
{
    try
    {
        return bcrypt.hashSync(text, 10);
    }
    catch (error)
    {
        return undefined;
    }
}
const getCurrentDateTime = () =>
{
    const date = new Date();
    return date.toISOString();
}
const getPostScore = (currentScore: number, postedDate: Date) =>
{
    const currentDate: Date = new Date(getCurrentDateTime());
    const postedDateObj: Date = new Date(postedDate);
    const diff = currentDate.getTime() - postedDateObj.getTime();

    const minutes = diff / (1000 * 60);
    const maxScore = 500;
    let timeScore = maxScore - minutes;
    getLogger().info(`Calculated post score -> ${currentScore + timeScore}`);
    return currentScore + timeScore;
}
const getFriendScore = (currentScore: number, friendship: string) =>
{
    const currentDate = new Date(getCurrentDateTime());
    const addedDate = new Date(friendship);
    const diff = currentDate.getTime() - addedDate.getTime();

    const days = diff / (1000 * 60 * 60 * 24);

    const maxScore = 500;

    let friendshipScore = maxScore - days;
 
    getLogger().info(`Calculated friendship score -> ${currentScore + friendshipScore}`);
    return currentScore + friendshipScore;
}
export  {
    isNullOrEmpty,
    minutesToMilliseconds,
    response,
    sliceEnd,
    getConfig,
    getSessionInfo,
    setSessionInfo,
    textTohash,
    getCurrentDateTime,
    getPostScore,
    getFriendScore
};