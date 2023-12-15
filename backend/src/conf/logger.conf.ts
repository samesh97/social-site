const logger = require('pino')();

const getLogger: any = () =>
{
    return logger;
}

export {
    getLogger
}