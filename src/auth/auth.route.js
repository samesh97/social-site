const { Config } = require("../conf/config.model");
const { User } = require("../user/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { Role } = require("../role/role.model");
const { getCache, setCache } = require('../conf/redis.conf');

const authRoute = Router();
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN | 300;
const tokenMapName = "auth-access-token-map";

const authentication = async (req, res, next) => 
{
  if (await isByPassAuth(req)) 
  {
    return next();
  }

  if(verifyAuthHeader(req))
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
  const accessToken = await createJWT(user.id);
  return res.status(201).json(
  {
      "access-token": accessToken,
  });

});

const isByPassAuth = async (req) => 
{
  const url = req.url;
  const urlWithoutBackSlash = url.endsWith("/") ? url.substring(0, url.length - 1) : url;

  const config = await Config.findOne({
    where: { name: "REST_AUTH_BYPASS_URL" },
  });

  return (config?.value?.split(",").some( (value) => value === urlWithoutBackSlash));
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

const createJWT = async (userId) => 
{

  const cachedTokenMap = await getCache(tokenMapName);
  const cachedToken = cachedTokenMap[userId];
  if( cachedToken && verifyToken(cachedToken) )
  {
      return cachedToken;
  }

  const token = jwt.sign( { userId }, jwtSecret, { expiresIn: jwtExpiresIn });
  addToTokenCache(userId, token);
  return token;
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
      const { userId } = jwt.verify(token, jwtSecret);
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
