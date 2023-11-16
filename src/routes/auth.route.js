const { Router } = require("express");

const
{
  isPlainPasswordMatches,
  verifyToken,
  isRefreshTokenRevoked,
  genAccessRefreshTokensAndSetAsCookies,
} = require("../utils/auth.util");

const { User } = require("../models/user.model");
const { generateResponse } = require("../dtos/response.dto");
const { config } = require("../configurations/common.conf");
const { isNullOrEmpty } = require("../utils/common.util");

const authRoute = Router();

authRoute.post("/login", async (req, res) =>
{
  const { email } = req.body;
  const { password } = req.body;

  //check email, password
  if (isNullOrEmpty(email, password)) {
    return generateResponse(res, "Email or Password not provided!", 400);
  }

  //find user in database
  const user = await User.findOne({ where: { email: email } });
  if (isNullOrEmpty(user)) {
    return generateResponse(res, "User not found.", 404);
  }

  //check e-mail verification
  if (!user.isVerified) {
    return generateResponse(res, "Email is not verified!", 400);
  }

  //verify plain password with hashed password
  if (!isPlainPasswordMatches(password, user.password)) {
    return generateResponse(res, "Invalid email, password combination.", 400);
  }

  await genAccessRefreshTokensAndSetAsCookies(res, user.id, true);
  return generateResponse(res, "Login success.", 200);
});

authRoute.post("/refresh", async (req, res) =>
{
  const refreshToken = req.cookies[config.REFRESH_TOKEN_COOKIE_NAME];
  if (isNullOrEmpty(refreshToken))
  {
    return generateResponse(res, "Refresh token not found", 404);
  }
  const object = verifyToken(refreshToken, config.JWT_REFRESH_TOKEN_SECRET);
  if (isNullOrEmpty(object))
  {
    return generateResponse(res, "Invalid refresh token", 400);
  }
  const user = await User.findByPk(object.userId);
  if (isNullOrEmpty(user))
  {
    return generateResponse(res,"User with associated refresh token not found",404);
  }
  if (await isRefreshTokenRevoked(refreshToken, object))
  {
    return generateResponse(res, "Refresh token is revoked.", 400);
  }

  await genAccessRefreshTokensAndSetAsCookies(res, user.id);
  return generateResponse(res, "Token refreshed.", 200);
});

authRoute.post("/verify", (req, res) =>
{
  const accessToken = req.cookies[config.ACCESS_TOKEN_COOKIE_NAME];
  if (isNullOrEmpty(accessToken))
  {
    return generateResponse(res, `Failed to verify.`, 400);
  }
  const result = verifyToken(accessToken, config.JWT_ACCESS_TOKEN_SECRET);
  if (isNullOrEmpty(result))
  {
    return generateResponse(res, `Failed to verify.`, 400);
  }
  return generateResponse(res, `Verified.`, 200);
});

module.exports = { authRoute };
