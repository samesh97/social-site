const { Router } = require('express');
const { Post, Reaction } = require('../models/post.model');
const { User } = require('../models/user.model');
const { config } = require('../configurations/common.conf');
const { Response, generateResponse} = require('../dtos/response.dto');
const postRoute = Router();

postRoute.post('/', async (req, res) => {
  const { userId } = req.body.userInfo;
  const { description } = req.body;
  if ( !userId || !description )
  {
    return generateResponse(res, 'Bad Request!', 400);
  }
  const user = await User.findOne({ where: { id: userId } });
  if (!user)
  {
      return generateResponse(res, "Invalid User!", 404);
  }
  const post = await Post.create({
    description: description,
    UserId: user.id,
  });
  return generateResponse(res, post, 201);
});

postRoute.get('/', async (req, res) => {
  const accessToken = req.cookies[config.ACCESS_TOKEN_COOKIE_NAME];
  const posts = await Post.findAll();
  return generateResponse(res, posts, 200);
});

postRoute.get('/:id', async (req, res) => {
  const userId = req.params.id;
  if (!userId)
  {
    return generateResponse(res, 'User not found!', 404);
  }
  const posts = await Post.findAll({ where: { id: userId } });
  return generateResponse(res, posts, 200);
});

module.exports = { postRoute };