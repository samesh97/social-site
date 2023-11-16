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

module.exports = { isNullOrEmpty };