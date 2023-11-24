const { getLogger } = require("../conf/logger.conf");
const { Response } = require("../dtos/response.dto");
const { Config } = require("../models/config.model");
const bcrypt = require("bcrypt");

const isNullOrEmpty = (...values) =>
{
    for (value of values)
    {
        if (!value)
        {
            getLogger().error("Values is null or empty");
            return true;    
        }
    }
    return false;
}

const isNotNullOrEmpty = (...values) => 
{
    for (value of values)
    {
        if (!value)
        {
            return false;
        }
    }
    return true;
}

const minutesToMilliseconds = (minutes) => 
{
    if (isNullOrEmpty(minutes))
    {
        return 0;
    }
    return minutes * 1000 * 60;
}

const response = (res, data, code) =>
{
    const response = new Response(data, code);
    return res.status(code).json(response);
};

const sliceEnd = (text, endChar) => 
{
    if (!text || !endChar)
    {
        return "";    
    }
    return text.endsWith(endChar) ? text.substring(0, text.length - 1): text;
}

const getConfig = async (name) =>
{
    const config = await Config.findOne({
        where: { name: name },
    });
    return config?.value;
}

const getSessionInfo = (req) => 
{
    const data = req.body.session;
    return data ? data : {};
}
const setSessionInfo = (req, data) => 
{
    req.body.session = data;
}

const textTohash = (text, saltRounds) => 
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
const getPostScore = (currentScore, postedDate) =>
{
    const currentDate = new Date(getCurrentDateTime());
    const postedDateObj = new Date(postedDate);
    const diff = currentDate - postedDateObj;

    const minutes = diff / (1000 * 60);
    const maxScore = 500;
    const minScore = -500;
    let timeScore = maxScore - minutes;
    if (minScore > timeScore)
    {
        timeScore = 0;    
    }
    console.log(`Calculated post score -> ${currentScore + timeScore}`)
    return currentScore + timeScore;
}
const getFriendScore = (currentScore, friendship) =>
{
    const currentDate = new Date(getCurrentDateTime());
    const addedDate = new Date(friendship);
    const diff = currentDate - addedDate;

    const days = diff / (1000 * 60 * 60 * 24);

    const maxScore = 500;
    const minScore = -500;

    let friendshipScore = maxScore - days;
    if (minScore > friendshipScore)
    {
        friendshipScore = 0;    
    }

    console.log(`Friendship score -> ${currentScore + friendshipScore}` );
    return currentScore + friendshipScore;
}
module.exports = {
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