const { Router } = require('express');
const { Post } = require('../models/post.model');
const { Reaction } = require('../models/reaction.model');
const { User } = require('../models/user.model');
const { Comment } = require('../models/comment.model');
const { Friend } = require('../models/friend.model');
const { response, getSessionInfo, isNullOrEmpty, getCurrentDateTime, getPostScore, getFriendScore } = require("../utils/common.util");
const { hasRole, authentication } = require('../utils/auth.util');
const { Roles } = require('../models/role.model');
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() });
const { uploadMultipleFile } = require('../conf/firebase.conf');
const { PostImage } = require('../models/post-image.model');
const { Op } = require('sequelize');
const { getLogger } = require('../conf/logger.conf');

const postRoute = Router();

postRoute.post('/', upload.array('post-images', 6), authentication, async (req, res) =>
{
  try
  {
    const { userId } = getSessionInfo(req);
    const { description } = req.body;
  
    let imageList = await uploadMultipleFile(req, 'posts');

    const time = getCurrentDateTime();
    imageList = imageList.map(item => {
      return {
        imageUrl: item,
        createdAt: time,
        updatedAt: time
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
    
    await Post.create({
      description: description,
      UserId: user.id,
      PostImages: imageList,
      createdAt: time,
      updatedAt: time
    }, { include: PostImage });
    
    return response(res, "Post created", 201);
  }
  catch (error)
  {
      getLogger().error(error);
      return response(res, "Error!", 500);
  }
});

postRoute.get('/', hasRole(Roles.USER), async (req, res) =>
{
  try
  {
    const { userId } = getSessionInfo(req);
    if (isNullOrEmpty(userId))
    {
      return response(res, "No valid session found", 400);  
    }

    const friends = await Friend.findAll({
      where: {
        [Op.or]: [
          {
            firstUserId: userId
          },
          {
            secondUserId: userId
          }
        ]
      }
    });

    const frienUserIds = friends.map(friend => {
      return friend.firstUserId == userId ? friend.secondUserId : friend.firstUserId
    });

    const posts = await Post.findAll(
      {
        where: {
          UserId: [...frienUserIds]
        },
        include: [
          { model: Reaction },
          { model: Comment, order: [['createdAt', 'DESC']], include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'profileUrl'] }] },
          { model: User, attributes: ['id', 'firstName', 'lastName', 'profileUrl'] },
          { model: PostImage, attributes: ['id', 'imageUrl']}
        ]
      });
    
    
    const postsWithScore = posts.map(post =>
    {
      const postUserId = post.User.id;
      const friendship = friends.filter(item => item.firstUserId == postUserId || item.secondUserId == postUserId)[0];
      const score = getFriendScore(friendship.score, friendship.createdAt);
      post.score = getPostScore(score, post.createdAt);
      return post;
    });

    const orderedPosts = postsWithScore.sort((a, b) => b.score - a.score);
    
    return response(res, orderedPosts, 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Error!", 500);
  }
});

postRoute.get('/:id', async (req, res) => {
  try
  {
    const userId = req.params.id;
    if (!userId)
    {
      return response(res, 'User not found!', 404);
    }
    const posts = await Post.findAll({
      where: { id: userId },
      include: [
      { model: Reaction },
      { model: Comment, include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'profileUrl'] }] },
      { model: User, attributes: ['id', 'firstName', 'lastName', 'profileUrl'] },
      { model: PostImage, attributes: ['id', 'imageUrl']}
    ],
    order:
    [
      ['id', 'DESC']
    ] });
    return response(res, posts, 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Error!", 500);
  }
});

module.exports = { postRoute };