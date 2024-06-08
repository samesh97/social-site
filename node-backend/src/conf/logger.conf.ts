import pino, { Logger } from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
    colorize: true
});

export const getLogger = (name: string = 'DEFAULT'): Logger =>
{
    return pino({
        name: name,
        level: 'info'
    },
    stream);
}