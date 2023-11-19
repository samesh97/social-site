const { Router } = require('express');
const { Post } = require('../models/post.model');
const { Reaction } = require('../models/reaction.model');
const { User } = require('../models/user.model');
const { config } = require('../conf/common.conf');
const { Comment } = require('../models/comment.model');
const { response, getSessionInfo, isNullOrEmpty } = require("../utils/common.util");
const { hasRole, authentication } = require('../utils/auth.util');
const { Roles } = require('../models/role.model');
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });
const { uploadMultipleFile } = require('../conf/firebase.conf');
const { PostImage } = require('../models/post-image.model');

const postRoute = Router();

postRoute.post('/', upload.array('post-images', 6), authentication, async (req, res) =>
{
  const { userId } = getSessionInfo(req);
  const { description } = req.body;

  let imageList = await uploadMultipleFile(req, 'posts');
  imageList = imageList.map(item => {
    return {
      imageUrl: item
    }
  });
  
  if ( isNullOrEmpty(userId, description) )
  {
    return response(res, 'Bad Request!', 400);
  }

  const user = await User.findOne({ where: { id: userId } });
  if (isNullOrEmpty(user))
  {
      return response(res, "Invalid User!", 404);
  }
  const post = await Post.create({
    description: description,
    UserId: user.id,
    PostImages: imageList
  }, { include: PostImage });
  
  return response(res, "Post created", 201);
});

postRoute.get('/', hasRole(Roles.USER), async (req, res) =>
{
  const accessToken = req.cookies[config.ACCESS_TOKEN_COOKIE_NAME];
  const posts = await Post.findAll(
    {
      include: [
        { model: Reaction },
        { model: Comment, include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'profileUrl'] }] },
        { model: User, attributes: ['id', 'firstName', 'lastName', 'profileUrl'] },
        { model: PostImage, attributes: ['id', 'imageUrl']}
      ],
    });
  return response(res, posts, 200);
});

postRoute.get('/:id', async (req, res) => {
  const userId = req.params.id;
  if (!userId)
  {
    return response(res, 'User not found!', 404);
  }
  const posts = await Post.findAll({ where: { id: userId } });
  return response(res, posts, 200);
});

module.exports = { postRoute };