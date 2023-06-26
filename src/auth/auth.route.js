const { Config, ConfigKey } = require("../conf/config.model");
const { User } = require("../user/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { Role } = require("../role/role.model");
const { getCache, setCache } = require('../conf/redis.conf');

const authRoute = Router();
require('dotenv').config();

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const accessTokentExpiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN | 300;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const refreshTokenExpiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN | '1d';
const tokenMapName = "auth-access-token-map";


authRoute.post("/", async (req, res) => 
{
  //verify username, password
  let username = req.body?.username;
  let password = req.body?.password;
  if (!username || !password) 
  {
      return res.status(400).json("Bad Request");
  }

  //find user in database
  const user = await User.findOne({ where: { username: username } });
  if (!user) 
  {
      return res.status(400).json("User not found");
  }
  //verify hashPassword & plain password
  let isHashValid = bcrypt.compareSync(password, user.password);
  if (!isHashValid) 
  {
      return res.status(400).json("Invalid username, password combination");
  }

  //create a jwt token and sign with userId
  return await createAccessRefreshTokenPayload(res, user.id);
});

authRoute.post('/refresh', async (req, res, next) => 
{
    const refreshToken = req.body.refreshToken;
    if( !refreshToken )
    {
        return res.status(400).json("Refresh token not found");
    }
    const userId = await verifyRefreshToken(refreshToken);
    if( !userId )
    {
        return res.status(400).json("Invalid refresh token");
    }
    const user = await User.findByPk(userId);
    if( !user )
    {
        return res.status(400).json("User with associated refresh token not found");
    }
    return await createAccessRefreshTokenPayload(res, userId);
});

const createAccessRefreshTokenPayload = async (res, userId) => {
  const accessToken = await createAccessToken(userId);
  const newRefreshToken = await createRefreshToken(userId);

  return res.status(201).json({
    "access-token": accessToken,
    "refresh-token": newRefreshToken
  });
}

const authentication = async (req, res, next) => 
{
  if ( await isByPassAuth(req) || verifyAuthHeader(req) ) 
  {
      return next();
  }
  return res.status(401).json("Unauthorized. You do not have permissions to perform this action.");
};

const hasRole = (...roles) => 
{
  return async (req, res, next) => 
  {
    const userId = req.body.userInfo?.userId;
    if (userId) 
    {
      const dbUser = await User.findByPk(userId, 
        { attributes: [], include: { model: Role, attributes: ["name"] }
      });

      const hasRole = dbUser.Roles.some(role => roles.includes(role.name));
      if( hasRole )
      {
        return next();
      }
    }
    res.status(403).json("Forbidden. You do not have permissions to perform this action.");
  };
};

const isByPassAuth = async (req) => 
{
  const url = req.url;
  const urlWithoutBackSlash = url.endsWith("/") ? url.substring(0, url.length - 1) : url;

  const config = await Config.findOne({
    where: { name: ConfigKey.REST_AUTH_BYPASS_URL },
  });

  return (config?.value?.split(",").some( (value) => 
  {
      if ( value && value.endsWith("*") )
      {
          const configWithoutAsterisk = value.substring(0, value.length - 1);
          let matchText = configWithoutAsterisk;
          if( configWithoutAsterisk.endsWith("/") )
          {
              matchText = configWithoutAsterisk.substring(0, configWithoutAsterisk.length - 1);
          }
          return urlWithoutBackSlash.startsWith(matchText);
          
      }
      return value === urlWithoutBackSlash;
  }));
}

const verifyAuthHeader = (req) => 
{
  let authHeader = req.headers.authorization;
  if (authHeader) 
  {
    const userId = verifyToken(authHeader);
    if (userId) 
    {
      req.body.userInfo = { userId: userId };
      return true;
    }
   
  }
  return false;
}

const createAccessToken = async (userId) => 
{
  const cachedTokenMap = await getCache(tokenMapName);
  if( cachedTokenMap )
  {
    const cachedToken = cachedTokenMap[userId];
    if( cachedToken && verifyToken(cachedToken) )
    {
        return cachedToken;
    }
  }

  const token = jwt.sign( { userId }, accessTokenSecret, { expiresIn: accessTokentExpiresIn });
  addToTokenCache(userId, token);
  return token;
}
const createRefreshToken = async (userId) =>
{
  const refreshToken = jwt.sign( { userId }, refreshTokenSecret, { expiresIn: refreshTokenExpiresIn });
  return refreshToken;
}

const addToTokenCache = async (userId, token) => 
{
  let cache = await getCache(tokenMapName);
  if( !cache )
  {
     cache = {};
  }
  cache[userId] = token;
  setCache(tokenMapName, cache);
}

const verifyToken = (token) =>  
{
  try 
  {
      const { userId } = jwt.verify(token, accessTokenSecret);
      if (userId) 
      {
          return userId;
      }
  } 
  catch (error) 
  {
      console.error(error);
  }
  return undefined;
}

const verifyRefreshToken = (token) =>  
{
  try 
  {
      const { userId } = jwt.verify(token, refreshTokenSecret);
      if (userId) 
      {
          return userId;
      }
  } 
  catch (error) 
  {
      console.error(error);
  }
  return undefined;
}

module.exports = { authentication, hasRole, authRoute };
