const { Router } = require("express");
const { Op } = require("sequelize");
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });
const { uploadFile } = require('../conf/firebase.conf');

const { User } = require("../models/user.model");
const { Role, Roles } = require("../models/role.model");
const { Post } = require("../models/post.model");
const { Comment } = require("../models/comment.model");
const { Reaction } = require("../models/reaction.model");
const { PostImage } = require("../models/post-image.model");
const { isNullOrEmpty, response, textTohash, getSessionInfo, getCurrentDateTime } = require("../utils/common.util");
const { getLogger } = require("../conf/logger.conf");

const userRoute = Router();

userRoute.post("/", upload.single('profilePic'), async (req, res) =>
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

userRoute.get("/search", async (req, res) =>
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

userRoute.get("/:id", async (req, res) =>
{
  try
  {
    const { id } = req.params;
    if (isNullOrEmpty(id))
    {
      return response(res, "No profile id found", 400);  
    }
  
    const user = await User.findOne(
      {
      where: { id: id },
        attributes: ['id', 'firstName', 'lastName', 'profileUrl'],
        include: [
          { model: Post, attributes: ['id', 'description'], include: [
            { model: Reaction },
            { model: Comment, include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'profileUrl'] }] },
            { model: User, attributes: ['id', 'firstName', 'lastName', 'profileUrl'] },
            { model: PostImage, attributes: ['id', 'imageUrl']}
          ] },]
    });
    return response(res, user, 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Error!", 500);
  }
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
