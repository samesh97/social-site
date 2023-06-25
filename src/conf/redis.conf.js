const { createClient }  = require("redis");

let isRedisConnected = false;
let redisClient = undefined;

const connectToRedis = async () => {
    redisClient = createClient();
    console.log("Connecting to Redis...");

    redisClient.on('ready', () => {
        isRedisConnected = true;
        console.log("Connected to Redis.");
    });
    redisClient.on('error', (err) => {
        isRedisConnected = false;
        console.error(`Error while connecting to Redis: ${err}`);
    });

    redisClient.connect();
}

const setCache = async (key, value) => {
    if (isRedisConnected)
    {
        const jsonStringifyObject = JSON.stringify(value);
        await redisClient.set(key, jsonStringifyObject);
    }
}

const getCache = async (key) => {
    if( isRedisConnected )
    {
        let result = await redisClient.get(key);
        if( result )
        {
            result = JSON.parse( result );
        }
        return result;
    }
    return null;
}

module.exports = { setCache, getCache, connectToRedis };
