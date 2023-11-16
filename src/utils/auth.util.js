const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User } = require("../models/user.model");
const { Role } = require("../models/role.model");
const { response } = require("../dtos/response.dto");
const { config } = require("../conf/common.conf");
const { Token, TokenStatus, TokenType } = require("../models/token.model");
const { Config, ConfigKey } = require("../models/config.model");
const { isNullOrEmpty, minutesToMilliseconds } = require("../utils/common.util");

const isPlainPasswordMatches = (palinText, hashedPassword) =>
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

const genAccessRefreshTokensAndSetAsCookies = async (res, userId, genRefreshToken = false) =>
{
  const accessToken = await genAccessToken(userId);
  const accessTokenExpiresIn = minutesToMilliseconds(config.JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES);

  setCookie(res, config.ACCESS_TOKEN_COOKIE_NAME, accessToken, accessTokenExpiresIn);

  if (genRefreshToken)
  {
    const newRefreshToken = await genRefreshToken(userId);
    const refreshTokenExpiresIn = minutesToMilliseconds(config.JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES);
    setCookie(res, config.REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, refreshTokenExpiresIn);
  }
};

const setCookie = (res, key, value, maxAge, httpOnly = true) => 
{
  res.cookie(key, value,
  {
    httpOnly: httpOnly,
    maxAge: maxAge,
  });
}

const hasRole = (...roles) => {
  return async (req, res, next) => {
    const userId = req.body.userInfo?.userId;
    if (isNullOrEmpty(userId) )
    {
      return response(res, "No userId found", 400);
    }
    const dbUser = await User.findByPk(userId, {
      attributes: [],
      include: { model: Role, attributes: ["name"] },
    });

    if (isNullOrEmpty(dbUser))
    {
      return response(res, "No user found", 404);
    }

    const hasRole = dbUser.Roles.some((role) => roles.includes(role.name));
    if (isNullOrEmpty(hasRole))
    {
      return response(
        res,
        "Forbidden. You do not have permissions to perform this action.",
        403
      );
    }
    return next();
  };
};

const isByPassAuth = async (req) =>
{
  const url = req.url;
  const urlWithoutBackSlash = url.endsWith("/")
    ? url.substring(0, url.length - 1)
    : url;

  const config = await Config.findOne({
    where: { name: ConfigKey.REST_AUTH_BYPASS_URL },
  });

  return config?.value?.split(",").some((value) => {
    if (value && value.endsWith("*")) {
      const configWithoutAsterisk = value.substring(0, value.length - 1);
      let matchText = configWithoutAsterisk;
      if (configWithoutAsterisk.endsWith("/")) {
        matchText = configWithoutAsterisk.substring(
          0,
          configWithoutAsterisk.length - 1
        );
      }
      return urlWithoutBackSlash.startsWith(matchText);
    }
    return value === urlWithoutBackSlash;
  });
};

const verifyAuthHeader = async (req) => {
  let authHeader = req.cookies[config.ACCESS_TOKEN_COOKIE_NAME];
  if (authHeader) {
    const object = verifyToken(authHeader, config.JWT_ACCESS_TOKEN_SECRET);
    if (object) {
      const dbToken = await getTokenFromDB(
        object.userId,
        TokenType.ACCESS_TOKEN
      );
      if (dbToken) {
        if (dbToken != authHeader) {
          const dbTokenPayload = verifyToken(
            dbToken,
            config.JWT_ACCESS_TOKEN_SECRET
          );
          if (dbTokenPayload && dbTokenPayload.iat > object.iat) {
            return false;
          }
        }
      }
      req.body.userInfo = { userId: object.userId };
      return true;
    }
  }
  return false;
};

const genAccessToken = async (userId) => {
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
const genRefreshToken = async (userId) => {
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

const verifyToken = (token, secret) => {
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
const isRefreshTokenRevoked = async (refreshToken, object) => {
  const dbRefreshToken = await getTokenFromDB(
    object.userId,
    TokenType.REFRESH_TOKEN
  );
  if (dbRefreshToken) {
    if (dbRefreshToken != refreshToken) {
      const dbRefreshTokenPayload = verifyToken(
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
  userId,
  tokenType,
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
  userId,
  token,
  tokenType,
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

const authentication = async (req, res, next) =>
{
  if ((await isByPassAuth(req)) || (await verifyAuthHeader(req)))
  {
    return next();
  }
  return response(res, "Unauthorized. You do not have permissions to perform this action.", 401);
};

module.exports = {
  isPlainPasswordMatches,
  genAccessRefreshTokensAndSetAsCookies,
  hasRole,
  isByPassAuth,
  verifyAuthHeader,
  authentication,
  verifyToken,
  isRefreshTokenRevoked,
};
