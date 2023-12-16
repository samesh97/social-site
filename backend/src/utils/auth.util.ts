import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { response, setSessionInfo, getSessionInfo } from "./common.util";
import { config } from "../conf/common.conf";
import { Token, TokenStatus, TokenType } from "../models/token.model";
import { Config, ConfigKey } from "../models/config.model";
import { isNullOrEmpty, minutesToMilliseconds, sliceEnd, getConfig } from "./common.util";
import { getLogger } from "../conf/logger.conf";
import { NextFunction, Request, Response } from "express";

const isPlainPasswordMatches = (palinText: string, hashedPassword: string) =>
{
  try
  {
    return bcrypt.compareSync(palinText, hashedPassword);
  }
  catch (error)
  {
    return false;
  }
};

const genAccessRefreshTokensAndSetAsCookies = async (res: Response, userId: string, refreshToken: boolean = false) =>
{
  const accessToken = await genAccessToken(userId);
  const accessTokenExpiresIn = minutesToMilliseconds(config.JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES);

  setCookie(res, config.ACCESS_TOKEN_COOKIE_NAME, accessToken, accessTokenExpiresIn);

  if (refreshToken)
  {
    const newRefreshToken = await genRefreshToken(userId);
    const refreshTokenExpiresIn = minutesToMilliseconds(config.JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES);
    setCookie(res, config.REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, refreshTokenExpiresIn);

    setCookie(res, config.CSRF_TOKEN_COOKIE_NAME, "12345", refreshTokenExpiresIn);
  }
};

const setCookie = (res: Response, key: string, value: string, maxAge: number, httpOnly = true) => 
{
  res.cookie(key, value,
  {
    httpOnly: httpOnly,
    maxAge: maxAge,
  });
}

const hasRole = (...roles: string[]) =>
{
  return async (req: Request, res: Response, next: NextFunction) =>
  {
    const { userId } = getSessionInfo(req);
    if (isNullOrEmpty(userId))
    {
      return response(res, "No session info found.", 400);
    }

    const dbUser: any = await User.findByPk(userId, {
      attributes: [],
      include: { model: Role, attributes: ["name"] },
    });

    if (isNullOrEmpty(dbUser))
    {
      return response(res, "No user found", 404);
    }

    if (isNullOrEmpty(dbUser.Role))
    {
      return response(res, "No role found.", 403);  
    }

    const dbUserRole = dbUser.Role.name;
    if (isNullOrEmpty(dbUserRole))
    {
      return response(res, "No role name found.", 403);  
    }
      
    const hasRole = roles.some(role => role == dbUserRole);
    if (!hasRole)
    {
      return response(res, "Forbidden. You do not have permissions to perform this action.", 403);
    }
    return next();
  };
};

const isByPassAuth = async (req: Request) =>
{
  const urlWithoutBackSlash = sliceEnd(req.url, "/");

  const config = await getConfig(ConfigKey.REST_AUTH_BYPASS_URL);
  if (isNullOrEmpty(config))
  {
    return false;  
  }

  const urls = config.split(",");

  const isByPass = urls.some((url: string) =>
  {
    if (isNullOrEmpty(url))
    {
      return false;  
    }
    if (url.endsWith("*"))
    {
      url = sliceEnd(url, "*");
      return urlWithoutBackSlash.startsWith(url);
    }
    return url === urlWithoutBackSlash;
  });
  getLogger().info("Bypassing authentication " + isByPass);
  return isByPass;
};

const verifyAuthHeader = async (req: Request) =>
{
  getLogger().info("Executing the verifyAuthHeader...");
  let authHeader = req.cookies[config.ACCESS_TOKEN_COOKIE_NAME];

  if (isNullOrEmpty(authHeader))
  {
    return false;  
  }
  const object: any = verifyToken(authHeader, config.JWT_ACCESS_TOKEN_SECRET);
  if (isNullOrEmpty(object))
  {
    return false;  
  }

  const dbToken = await getTokenFromDB(object.userId, TokenType.ACCESS_TOKEN);
  if (isNullOrEmpty(dbToken))
  {
    return false;  
  }
  
  if (dbToken != authHeader)
  {
    return false;  
  }

  //checking csrf token
  // const csrfToken = req.headers[config.CSRF_TOKEN_COOKIE_NAME];
  // if (isNullOrEmpty(csrfToken))
  // {
  //   return false;  
  // }
  
  getLogger().info("Setting user session..");
  setSessionInfo(req, object);
  return true;
};

const genAccessToken = async (userId: string) => {
  const currentEpochTime = Date.now;
  const object = {
    userId,
    issuedAt: currentEpochTime,
  };
  const expiresInSeconds = config.JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES * 60;
  const token = jwt.sign(object, config.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: expiresInSeconds,
  });
  await saveTokenInDB(userId, token, TokenType.ACCESS_TOKEN);
  return token;
};
const genRefreshToken = async (userId: string) => {
  const currentEpochTime = Date.now;
  const object = {
    userId,
    issuedAt: currentEpochTime,
  };
  const expiresInSeconds = config.JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES * 60;
  const refreshToken = jwt.sign(object, config.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: expiresInSeconds,
  });
  await saveTokenInDB(userId, refreshToken, TokenType.REFRESH_TOKEN);
  return refreshToken;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const object = jwt.verify(token, secret);
    if (object) {
      return object;
    }
  } catch (error) {
    console.error(error);
  }
  return undefined;
};
const isRefreshTokenRevoked = async (refreshToken: string, object: any) => {
  const dbRefreshToken = await getTokenFromDB(
    object.userId,
    TokenType.REFRESH_TOKEN
  );
  if (dbRefreshToken) {
    if (dbRefreshToken != refreshToken) {
      const dbRefreshTokenPayload: any = verifyToken(
        dbRefreshToken,
        config.JWT_REFRESH_TOKEN_SECRET
      );
      if (dbRefreshTokenPayload && dbRefreshTokenPayload.iat > object.iat) {
        return true;
      }
    }
  }
  return false;
};

const getTokenFromDB = async (
  userId: string,
  tokenType: any,
  tokenStatus = TokenStatus.WHITELISTED
) => {
  const token = await Token.findOne({
    where: {
      userId: userId,
      type: tokenType,
      status: tokenStatus,
    },
    attributes: ["token"],
  });
  return token ? token.token : undefined;
};

const saveTokenInDB = async (
  userId: string,
  token: string,
  tokenType: any,
  tokenStatus = TokenStatus.WHITELISTED
) => {
  const currentToken = await Token.findOne({
    where: {
      userId: userId,
      type: tokenType,
      status: tokenStatus,
    },
  });

  if (currentToken) {
    await Token.update(
      {
        userId: userId,
        type: tokenType,
        status: tokenStatus,
        token: token,
      },
      {
        where: { id: currentToken.id },
      }
    );
  } else {
    await Token.create({
      userId: userId,
      type: tokenType,
      status: tokenStatus,
      token: token,
    });
  }
};

const authentication = async (req: Request, res: Response, next: NextFunction) =>
{
  getLogger().info("Executing authentication.");
  if ((await isByPassAuth(req)) || (await verifyAuthHeader(req)))
  {
    return next();
  }
  return response(res, "Unauthorized. You do not have permissions to perform this action.", 401);
};

const getCookie = (req: Request, name: string) =>
{
  return req.cookies[name];
}

export  {
  isPlainPasswordMatches,
  genAccessRefreshTokensAndSetAsCookies,
  hasRole,
  isByPassAuth,
  verifyAuthHeader,
  authentication,
  verifyToken,
  isRefreshTokenRevoked,
  getCookie
};
