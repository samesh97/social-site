import { Request, Response, Router } from "express";

import
{
  isPlainPasswordMatches,
  verifyToken,
  isRefreshTokenRevoked,
  genAccessRefreshTokensAndSetAsCookies,
  getCookie,
} from "../utils/auth.util";

import { User } from "../models/user.model";
import { response, getSessionInfo } from "../utils/common.util";
import { config } from "../conf/common.conf";
import { isNullOrEmpty } from "../utils/common.util";
import { Token, TokenStatus } from "../models/token.model";
import { getLogger } from "../conf/logger.conf";

const authRoute = Router();

authRoute.post("/login", async (req: Request, res: Response) =>
{
  try
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

    //verify plain password with hashed password
    if (!isPlainPasswordMatches(password, user.password))
    {
      return response(res, "Invalid email, password combination.", 400);
    }

    await genAccessRefreshTokensAndSetAsCookies(res, user.id, true);

    const returnUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileUrl: user.profileUrl
    }
    return response(res, returnUser, 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Failed", 500);
  }
});

authRoute.post("/refresh", async (req, res) =>
{
  try
  {
    const refreshToken = req.cookies[config.REFRESH_TOKEN_COOKIE_NAME];
    if (isNullOrEmpty(refreshToken))
    {
      return response(res, "Refresh token not found", 401);
    }
    const object = verifyToken(refreshToken, config.JWT_REFRESH_TOKEN_SECRET);
    if (isNullOrEmpty(object))
    {
      return response(res, "Invalid refresh token", 401);
    }
    const user = await User.findByPk(object.userId);
    if (isNullOrEmpty(user))
    {
      return response(res,"User with associated refresh token not found",401);
    }
    if (await isRefreshTokenRevoked(refreshToken, object))
    {
      return response(res, "Refresh token is revoked.", 401);
    }

    await genAccessRefreshTokensAndSetAsCookies(res, user.id);
    return response(res, "Token refreshed.", 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Failed", 500);
  }
});

authRoute.post("/verify", async (req, res) =>
{
  try
  {
    const { userId } = getSessionInfo(req); 
    const accessToken = getCookie(req, config.ACCESS_TOKEN_COOKIE_NAME);
    const refreshToken = getCookie(req, config.REFRESH_TOKEN_COOKIE_NAME);
    if (isNullOrEmpty(accessToken) && isNullOrEmpty(refreshToken))
    {
      return response(res, `Failed to verify.`, 401);
    }
    const result = verifyToken(accessToken, config.JWT_ACCESS_TOKEN_SECRET);
    if (isNullOrEmpty(result))
    {
      const refreshTokenContent = verifyToken(refreshToken, config.JWT_REFRESH_TOKEN_SECRET);
      if (isNullOrEmpty(refreshTokenContent))
      {
        return response(res, `Failed to verify.`, 401);
      }
      
    }

    const user = await User.findByPk(userId);
    const returnUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileUrl: user.profileUrl
    }

    return response(res, returnUser, 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Failed", 500);
  }
});

authRoute.post("/logout", async (req, res) =>
{
  try
  {
    const accessToken = getCookie(req, config.ACCESS_TOKEN_COOKIE_NAME);
    if (isNullOrEmpty(accessToken))
    {
      return response(res, "No session info found", 401);  
    }

    const result = verifyToken(accessToken, config.JWT_ACCESS_TOKEN_SECRET);
    if (isNullOrEmpty(result))
    {
      return response(res, `Failed to verify.`, 400);
    }

    await Token.destroy({ where: { userId: result.userId, status: TokenStatus.WHITELISTED } });
    return response(res, "Logout success", 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Failed", 500);
  }
});

export {
  authRoute
}
