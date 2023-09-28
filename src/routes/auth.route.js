const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Router } = require("express");

const { User } = require("../models/user.model");
const { Role } = require("../models/role.model");
const { Response } = require("../dtos/response.dto");
const { config } = require("../configurations/common.conf");
const { Token, TokenStatus, TokenType } = require("../models/token.model");
const { Config, ConfigKey } = require("../models/config.model");

const authRoute = Router();

authRoute.post("/login", async (req, res) => {
  //verify username, password
  let username = req.body?.username;
  let password = req.body?.password;
  if (!username || !password) {
    return generateResponse(res, "Bad Request.", 400);
  }

  //find user in database
  const user = await User.findOne({ where: { username: username } });
  if (!user) {
    return generateResponse(res, "User not found.", 404);
  }
  //verify hashPassword & plain password
  let isHashValid = bcrypt.compareSync(password, user.password);
  if (!isHashValid) {
    return generateResponse(
      res,
      "Invalid username, password combination.",
      400
    );
  }

  await genAccessRefreshTokensAndSetAsCookies(res, user.id, true);
  return generateResponse(res, "Login success.", 200);
});

authRoute.post("/refresh", async (req, res, next) => {
  const refreshToken = req.cookies["x-refresh-token"];
  if (!refreshToken) {
    return generateResponse(res, "Refresh token not found", 404);
  }
  const object = verifyToken(refreshToken, config.JWT_REFRESH_TOKEN_SECRET);
  if (!object) {
    return generateResponse(res, "Invalid refresh token", 400);
  }
  const user = await User.findByPk(object.userId);
  if (!user) {
    return generateResponse(
      res,
      "User with associated refresh token not found",
      404
    );
  }
  if (await isRefreshTokenRevoked(refreshToken, object)) {
    return generateResponse(res, "Refresh token is revoked.", 400);
  }

  await genAccessRefreshTokensAndSetAsCookies(res, user.id);
  return generateResponse(res, "Token refreshed.", 200);
});

authRoute.post("/verify", (req, res) => {
  const accessToken = req.cookies["x-access-token"];
  if (!accessToken) {
    return generateResponse(res, `Failed to verify.`, 400);
  }
  const result = verifyToken(accessToken, config.JWT_ACCESS_TOKEN_SECRET);
  if (!result) {
    return generateResponse(res, `Failed to verify.`, 400);
  }
  return generateResponse(res, `Verified.`, 200);
});

const genAccessRefreshTokensAndSetAsCookies = async (
  res,
  userId,
  isRefreshTokenGenerated = false
) => {
  //create a jwt token and sign with userId
  const accessToken = await createAccessToken(userId);
  const newRefreshToken = await createRefreshToken(userId);

  const accessTokenExpiresInMiliseconds =
    config.JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES * 1000 * 60;

  //set server side cookies
  res.cookie("x-access-token", accessToken, {
    httpOnly: true,
    maxAge: accessTokenExpiresInMiliseconds,
  });

  if (isRefreshTokenGenerated) {
    const refreshTokenExpiresInMiliseconds =
      config.JWT_REFRESH_TOKEN_EXPIRES_IN_MINUTES * 1000 * 60;
    res.cookie("x-refresh-token", newRefreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresInMiliseconds,
    });
  }
};

const authentication = async (req, res, next) => {
  if ((await isByPassAuth(req)) || (await verifyAuthHeader(req))) {
    return next();
  }
  return generateResponse(
    res,
    "Unauthorized. You do not have permissions to perform this action.",
    401
  );
};

const hasRole = (...roles) => {
  return async (req, res, next) => {
    const userId = req.body.userInfo?.userId;
    if (userId) {
      const dbUser = await User.findByPk(userId, {
        attributes: [],
        include: { model: Role, attributes: ["name"] },
      });

      const hasRole = dbUser.Roles.some((role) => roles.includes(role.name));
      if (hasRole) {
        return next();
      }
    }
    return generateResponse(
      res,
      "Forbidden. You do not have permissions to perform this action.",
      403
    );
  };
};

const isByPassAuth = async (req) => {
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
  let authHeader = req.cookies["x-access-token"];
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

const createAccessToken = async (userId) => {
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
const createRefreshToken = async (userId) => {
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

generateResponse = (res, data, code) => {
  const response = new Response();
  response.data = data;
  response.code = code;
  return res.status(code).json(response);
};

module.exports = { authentication, hasRole, authRoute };
