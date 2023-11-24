const logger = require('pino')();

getLogger = () =>
{
    return logger;
}

module.exports = { getLogger };