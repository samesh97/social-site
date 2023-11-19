const { Router } = require("express");
const { Op } = require("sequelize");
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });
const { uploadFile } = require('../conf/firebase.conf');

const { User } = require("../models/user.model");
const { Role, Roles } = require("../models/role.model");
const { Post } = require("../models/post.model");
const { Comment } = require("../models/comment.model");
const { isNullOrEmpty, response, textTohash, getSessionInfo } = require("../utils/common.util");

const userRoute = Router();

userRoute.post("/", upload.single('profilePic'), async (req, res) =>
{
  const downloadURL = await uploadFile(req, 'profile-pic');
  
  const user = req.body;
  const validationError = await validateUserCreation(user);
  if (validationError)
  {
    return response(res, validationError, 400);
  }
  
  const hashedPassword = textTohash(user.password, 10);
  
  try
  {
    const userRole = await Role.findOne({ where: { name: Roles.USER } });
    await User.create(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: hashedPassword,
        roleId: userRole.id,
        profileUrl: downloadURL
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
});

userRoute.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (isNullOrEmpty(id))
  {
    return response(res, "No profile id found", 400);  
  }

  const user = await User.findOne({ where: { id: id }, attributes: ['id', 'firstName', 'lastName'] , include: [{ model: Post, attributes: ['id', 'description'], include: [{ model: Comment }, { model: User, attributes: ['firstName', 'lastName']}]}, ]});
  return response(res, user, 200);

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
