import { Request, Response, Router } from "express";

import
{
  isPlainPasswordMatches,
  verifyToken,
  isRefreshTokenRevoked,
  generateTokens,
  getCookie,
} from "../utils/auth.util";

import { User } from "../models/user.model";
import { response, generateRandomUUID } from "../utils/common.util";
import { config } from "../conf/common.conf";
import { isNullOrEmpty } from "../utils/common.util";
import { Token, TokenStatus } from "../models/token.model";
import { getLogger } from "../conf/logger.conf";

const authRoute = Router();

authRoute.post("/login", async (req: Request, res: Response) =>
{
  try
  {
    const { email, password } = req.body;

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

    const sessiondId = generateRandomUUID();
    await generateTokens(res, user.id, sessiondId, true);

    const resObject = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileUrl: user.profileUrl,
      sessionId: sessiondId
    }
    return response(res, resObject, 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Server side error was occured.", 500);
  }
});

authRoute.post("/refresh", async (req, res) =>
{
  try
  {
    const refreshToken = getCookie(req, config.REFRESH_TOKEN_COOKIE_NAME);
    if (isNullOrEmpty(refreshToken))
    {
      return response(res, "Refresh token not found", 401);
    }

    const object: any = verifyToken(refreshToken, config.JWT_REFRESH_TOKEN_SECRET);
    if (isNullOrEmpty(object))
    {
      return response(res, "Invalid refresh token", 401);
    }

    const user = await User.findByPk(object.userId);
    if (isNullOrEmpty(user))
    {
      return response(res,"User with associated refresh token not found", 401);
    }
    //check if the token is revoked
    const isRevoked = await isRefreshTokenRevoked(refreshToken, object);
    if (isRevoked)
    {
      return response(res, "Refresh token is revoked.", 401);
    }

    const sessionId = generateRandomUUID();
    await generateTokens(res, user.id, sessionId);
    return response(res, { sessionId }, 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Server side error occured", 500);
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

    const result: any = verifyToken(accessToken, config.JWT_ACCESS_TOKEN_SECRET);
    if (isNullOrEmpty(result))
    {
      return response(res, `Invalid user session`, 400);
    }

    //destroy the tokens in database
    await Token.destroy(
    {
        where:
        {
          userId: result.userId,
          status: TokenStatus.WHITELISTED
        }
    });
    
    return response(res, "Successfully logout", 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Server side error occured", 500);
  }
});

export
{
  authRoute
}
