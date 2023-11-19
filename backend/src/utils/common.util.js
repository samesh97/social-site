const { Response } = require("../dtos/response.dto");
const { Config, ConfigKey } = require("../models/config.model");
const bcrypt = require("bcrypt");

const isNullOrEmpty = (...values) =>
{
    for (value of values)
    {
        if (!value)
        {
            console.log("Values is null or empty -> " + value);
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
module.exports = { isNullOrEmpty, minutesToMilliseconds, response, sliceEnd, getConfig, getSessionInfo, setSessionInfo, textTohash };