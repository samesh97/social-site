const { Router } = require("express");

const
{
  isPlainPasswordMatches,
  verifyToken,
  isRefreshTokenRevoked,
  genAccessRefreshTokensAndSetAsCookies,
} = require("../utils/auth.util");

const { User } = require("../models/user.model");
const { response } = require("../utils/common.util");
const { config } = require("../conf/common.conf");
const { isNullOrEmpty } = require("../utils/common.util");

const authRoute = Router();

authRoute.post("/login", async (req, res) =>
{
  const { email } = req.body;
  const { password } = req.body;

  //check email, password
  if (isNullOrEmpty(email, password))
  {
    return response(res, "Email or Password not provided!", 400);
  }

  //find user in database
  const user = await User.findOne({ where: { email: email } });
  if (isNullOrEmpty(user))
  {
    return response(res, "User not found.", 404);
  }

  //check e-mail verification
  if (!user.isVerified)
  {
    return response(res, "Email is not verified!", 400);
  }

  //verify plain password with hashed password
  if (!isPlainPasswordMatches(password, user.password)) {
    return response(res, "Invalid email, password combination.", 400);
  }

  await genAccessRefreshTokensAndSetAsCookies(res, user.id, true);
  return response(res, "Login success.", 200);
});

authRoute.post("/refresh", async (req, res) =>
{
  const refreshToken = req.cookies[config.REFRESH_TOKEN_COOKIE_NAME];
  if (isNullOrEmpty(refreshToken))
  {
    return response(res, "Refresh token not found", 404);
  }
  const object = verifyToken(refreshToken, config.JWT_REFRESH_TOKEN_SECRET);
  if (isNullOrEmpty(object))
  {
    return response(res, "Invalid refresh token", 400);
  }
  const user = await User.findByPk(object.userId);
  if (isNullOrEmpty(user))
  {
    return response(res,"User with associated refresh token not found",404);
  }
  if (await isRefreshTokenRevoked(refreshToken, object))
  {
    return response(res, "Refresh token is revoked.", 400);
  }

  await genAccessRefreshTokensAndSetAsCookies(res, user.id);
  return response(res, "Token refreshed.", 200);
});

authRoute.post("/verify", (req, res) =>
{
  const accessToken = req.cookies[config.ACCESS_TOKEN_COOKIE_NAME];
  if (isNullOrEmpty(accessToken))
  {
    return response(res, `Failed to verify.`, 400);
  }
  const result = verifyToken(accessToken, config.JWT_ACCESS_TOKEN_SECRET);
  if (isNullOrEmpty(result))
  {
    return response(res, `Failed to verify.`, 400);
  }
  return response(res, `Verified.`, 200);
});

module.exports = { authRoute };
