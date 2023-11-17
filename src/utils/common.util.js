const { Response } = require("../dtos/response.dto");
const { Config, ConfigKey } = require("../models/config.model");

const isNullOrEmpty = (...values) =>
{
    for (value of values)
    {
        if (!value)
        {
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
    return req.body.session;
}
const setSessionInfo = (req, data) => 
{
    req.body.session = data;
}
module.exports = { isNullOrEmpty, minutesToMilliseconds, response, sliceEnd, getConfig, getSessionInfo, setSessionInfo };