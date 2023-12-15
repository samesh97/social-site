import { Router, Request, Response } from "express";
import { UserDto } from "../dtos/user.dto";

import { Op } from "sequelize";
import multer from 'multer';
import { uploadFile } from '../conf/firebase.conf';
import { User } from "../models/user.model";
import { Role, Roles } from "../models/role.model";
import { isNullOrEmpty, response, textTohash, getSessionInfo, getCurrentDateTime } from "../utils/common.util";
import { getLogger } from "../conf/logger.conf";
import { getUserWithPosts, getUserFriends } from "../utils/db-query.util";

const upload = multer({ storage: multer.memoryStorage() });

const userRoute: Router  = Router();

userRoute.post("/", upload.single('profilePic'), async (req: Request, res: Response) =>
{
  try
  {
    const downloadURL = await uploadFile(req, 'profile-pic');
  
    const user = req.body;
    const validationError = await validateUserCreation(user);
    if (validationError)
    {
      return response(res, validationError, 400);
    }
    
    const hashedPassword = textTohash(user.password, 10);
    
    const userRole = await Role.findOne({ where: { name: Roles.USER } });

    const time = getCurrentDateTime();
    await User.create(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashedPassword,
        roleId: userRole.id,
        profileUrl: downloadURL,
        createdAt: time,
        updatedAt: time
      }
    );
    return response(res,"User created.", 201);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Error!", 500);
  }
});

userRoute.get("/search", async (req: Request, res: Response) =>
{
  try
  {
    const { userId } = getSessionInfo(req);
    if (isNullOrEmpty(userId))
    {
      return response(res, "No valid session found", 400);  
    }
    const keyword = req.query.keyword;
    if (isNullOrEmpty(keyword))
    {
      return response(res, "No keyword found!", 400);  
    }
  
    const users = await User.findAll({
      where: {
        [Op.or]:
        [
          {
            firstName: { [Op.startsWith]: [keyword] }
          },
          {
            lastName: { [Op.startsWith]: [keyword] }  
          }
        ]
      },
      attributes: ['id', 'firstName', 'lastName']
    });
    
    return response(res, users, 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Error!", 500);
  }
});

userRoute.get("/:id", async (req: Request, res: Response) =>
{
  try
  {
    const { id } = req.params;
    if (isNullOrEmpty(id))
    {
      return response(res, "No profile id found", 400);  
    }
  
    const user = await getUserWithPosts(id);
    if (user)
    {
      const friends = await getUserFriends(id, false, true);
      user.dataValues.Friends = friends; 
    }
    
    return response(res, user, 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Error!", 500);
  }
});

const validateUserCreation = async (user: UserDto) =>
{
  const { email, password, firstName, lastName } = user;
  if (isNullOrEmpty( email, password, firstName, lastName ))
  {
    return "Bad Request";
  }

  const dbUser = await User.findOne({ where: { email: user.email } });
  if (dbUser)
  {
    return "Email is already taken.";
  }
  return null;
};

export {
  userRoute
}

