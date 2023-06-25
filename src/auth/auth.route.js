const { Config } = require("../conf/config.model");
const { User, User_Role } = require("../user/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { Role } = require("../role/role.model");
const { getCache, setCache } = require('../conf/redis.conf');
const authRoute = Router();
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
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

const hasRole = (...roles) => {
  return async (req, res, next) => {
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

authRoute.post("/", async (req, res) => {
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
  const accessToken = createJWT(user.id);
  return res.status(200).json(
  {
    "access-token": accessToken,
  });

});

const isByPassAuth = async (req) => {
  const url = req.url;
  const urlWithoutBackSlash = url.endsWith("/") ? url.substring(0, url.length - 1) : url;

  const config = await Config.findOne({
    where: { name: "REST_AUTH_BYPASS_URL" },
  });

  return (config?.value?.split(",").some( (value) => value === urlWithoutBackSlash));
}

const verifyAuthHeader = (req) => {
  let authHeader = req.headers.authorization;
  let isVerified = false;
  if (authHeader) 
  {
    try 
    {
      const userId = jwt.verify(authHeader, jwtSecret);
      if (userId) 
      {
        req.body.userInfo = { userId: userId };
        isVerified = true;
      }
    } 
    catch (error) 
    {
      console.error(error);
    }
  }
  return isVerified;
}

const createJWT = (userId) => {
  const token = jwt.sign(userId, jwtSecret);
  addToTokenCache(token);
  return token;
}
const addToTokenCache = async (token) => {
  const tokenMapName = "auth-access-token-map";
  let cache = await getCache(tokenMapName);
  if( !cache )
  {
     cache = [];
  }
  cache.push( token );
  setCache(tokenMapName, cache);
}

module.exports = { authentication, hasRole, authRoute };
