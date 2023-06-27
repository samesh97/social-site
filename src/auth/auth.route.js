const { Config, ConfigKey } = require("../conf/config.model");
const { User } = require("../user/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { Role } = require("../role/role.model");
const { Token, TokenStatus, TokenType } = require("../token/token.model");

const authRoute = Router();
require('dotenv').config();

const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const accessTokentExpiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN | 300;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const refreshTokenExpiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN | 7776000;


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
    const object = verifyToken(refreshToken, refreshTokenSecret);
    if( !object )
    {
        return res.status(400).json("Invalid refresh token");
    }
    const user = await User.findByPk(object.userId);
    if( !user )
    {
        return res.status(400).json("User with associated refresh token not found");
    }
    if ( await isRefreshTokenRevoked(refreshToken, object) )
    {
        return res.status(400).json("Refresh token is revoked.");
    }
    return await createAccessRefreshTokenPayload(res, object.userId);
});

const createAccessRefreshTokenPayload = async (res, userId) => 
{
  const accessToken = await createAccessToken(userId);
  const newRefreshToken = await createRefreshToken(userId);

  return res.status(201).json({
    "access-token": accessToken,
    "refresh-token": newRefreshToken
  });
}

const authentication = async (req, res, next) => 
{
  if ( await isByPassAuth(req) || await verifyAuthHeader(req) ) 
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

const verifyAuthHeader = async (req) => 
{
  let authHeader = req.headers.authorization;
  if (authHeader) 
  {
    const object = verifyToken(authHeader, accessTokenSecret);
    if ( object ) 
    {
      const dbToken = await getTokenFromDB( object.userId, TokenType.ACCESS_TOKEN );
      if( dbToken )
      {
          if( dbToken != authHeader )
          {
            const dbTokenPayload = verifyToken(dbToken, accessTokenSecret);
            if( dbTokenPayload && dbTokenPayload.iat > object.iat )
            {
                return false;
            }
          }
      }
      req.body.userInfo = { userId: object.userId };
      return true;
    }
   
  }
  return false;
}

const createAccessToken = async (userId) => 
{
  const currentEpochTime = Date.now;
  const object = {
      userId,
      issuedAt: currentEpochTime
  };
  const token = jwt.sign( object, accessTokenSecret, { expiresIn: accessTokentExpiresIn });
  await saveTokenInDB(userId, token, TokenType.ACCESS_TOKEN);
  return token;
}
const createRefreshToken = async (userId) =>
{
  const currentEpochTime = Date.now;
  const object = {
      userId,
      issuedAt: currentEpochTime
  };
  const refreshToken = jwt.sign( object, refreshTokenSecret, { expiresIn: refreshTokenExpiresIn });
  await saveTokenInDB(userId, refreshToken, TokenType.REFRESH_TOKEN);
  return refreshToken;
}

const verifyToken = (token, secret) =>  
{
  try 
  {
      const object = jwt.verify(token, secret);
      if (object) 
      {
          return object;
      }
  } 
  catch (error) 
  {
      console.error(error);
  }
  return undefined;
}
const isRefreshTokenRevoked = async (refreshToken, object) => 
{
  const dbRefreshToken = await getTokenFromDB(object.userId, TokenType.REFRESH_TOKEN);
  if ( dbRefreshToken )
  {
      if( dbRefreshToken != refreshToken )
      {
          const dbRefreshTokenPayload = verifyToken(dbRefreshToken, refreshTokenSecret);
          if( dbRefreshTokenPayload && dbRefreshTokenPayload.iat > object.iat )
          {
              return true;
          }
      }
  }
  return false;
}

const getTokenFromDB = async (userId, tokenType, tokenStatus = TokenStatus.WHITELISTED ) => 
{
    const token = await Token.findOne(
    { 
        where: 
        { 
          userId: userId, 
          type: tokenType, 
          status: tokenStatus 
        },
        attributes: ["token"]
    });
    return token ? token.token : undefined;
}

const saveTokenInDB = async (userId, token, tokenType, tokenStatus = TokenStatus.WHITELISTED ) =>
{
    const currentToken = await Token.findOne({
      where:
      {
        userId: userId,
        type: tokenType,
        status: tokenStatus
      }
    });

    if( currentToken )
    {
       await Token.update({
        userId: userId,
        type: tokenType,
        status: tokenStatus,
        token: token
      }, 
      { 
        where: { id: currentToken.id }
      });
    }
    else
    {
      await Token.create({
        userId: userId,
        type: tokenType,
        status: tokenStatus,
        token: token
      });
    }
}

module.exports = { authentication, hasRole, authRoute };
