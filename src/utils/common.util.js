const { Response } = require("../dtos/response.dto"); 

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
    if (isNotNullOrEmpty(minutes))
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

module.exports = { isNullOrEmpty, minutesToMilliseconds, response };