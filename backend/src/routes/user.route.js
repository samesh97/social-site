const { Router } = require("express");
const { Op } = require("sequelize");

const { User, User_Role } = require("../models/user.model");
const { Role, Roles } = require("../models/role.model");
const { sequelize } = require("../conf/database.conf");
const { isNullOrEmpty, response, textTohash, getSessionInfo } = require("../utils/common.util");

const userRoute = Router();

userRoute.post("/", async (req, res) =>
{
  const user = req.body;
  const validationError = await validateUserCreation(user);
  if (validationError)
  {
    return response(res, validationError, 400);
  }

  const hashedEmail = textTohash(user.email, 10);
  const hashedPassword = textTohash(user.password, 10);
  
  try
  {
    const userRole = await Role.findOne({ where: { name: Roles.USER } });
    await User.create(
      {
        id: hashedEmail,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashedPassword,
        roleId: userRole.id
      }
    );
    return response(res,"User created.", 201);
  }
  catch (error)
  {
    console.log(error);
    return res.status(500).json(`Error while creating user.`);
  }
});

userRoute.get("/search", async (req, res) =>
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
      firstName: {
        [Op.like]: keyword
      }
    }
  });
  
  return response(res, users, 200);
});

const validateUserCreation = async (user) =>
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

module.exports = { userRoute };
