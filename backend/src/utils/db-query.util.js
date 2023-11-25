const { Op, Sequelize } = require("sequelize");

const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
const { Reaction } = require('../models/reaction.model');
const { PostImage } = require('../models/post-image.model');
const { Comment } = require('../models/comment.model');
const { Friend } = require('../models/friend.model');

const userAttributes = ['id', 'firstName', 'lastName', 'profileUrl'];
const postAttributes = ['id', 'description', 'createdAt', 'updatedAt'];
const commentAttributes = ['id', 'description', 'createdAt', 'updatedAt'];
const postImageAttributes = ['id', 'imageUrl'];
const friendAttributes = ['requestedUser', 'acceptedUser', 'isAccepted'];


const getUser = async (userId) =>
{
    return await User.findOne({
        where: { id: userId },
        attributes: userAttributes
    });
}
const getUserWithPosts = async (userId) =>
{
    return await User.findOne({
        where: { id: userId },
          attributes: userAttributes,
          include:
            [
              {
                model: Post,
                attributes: postAttributes,
                include:
                  [
                    {
                        model: Reaction
                    },
                    {
                        model: Comment,
                        include:
                        [
                           {
                             model: User,
                             attributes: userAttributes
                           }
                        ]
                    },
                    {
                        model: User,
                        attributes: userAttributes
                    },
                    {
                        model: PostImage,
                        attributes: postImageAttributes
                    }
                  ]
              }
            ]
      });
}

const getUserFriends = async (userId, ...accepted) =>
{
    return await Friend.findAll({
      attributes: friendAttributes,
      where:
      {
          [Op.or]:
          [
              {
                requestedUser: userId,
                isAccepted: accepted
              },
              {
                acceptedUser: userId,
                isAccepted: accepted
              }
          ]
      }
      });
}

const getFriendship = async (userId1, userId2) =>
{
    return await Friend.findOne({
      attributes: friendAttributes,
      where: {
          [Op.and]:
            [
              {
                requestedUser: [userId1, userId2],
              },
              {
                acceptedUser: [userId1, userId2]
              }
            ],
        }
      });
}

const getFriendsPosts = async (friendsIds) => {
  if (friendsIds.length == 0)
  {
    return []; 
  }
  return await Post.findAll(
    {
      where: {
        UserId: [...friendsIds]
      },
      include: [
        { model: Reaction },
        { model: Comment, include: [{ model: User, attributes: userAttributes }] },
        { model: User, attributes: userAttributes },
        { model: PostImage, attributes: postImageAttributes}
      ]
    });
}

module.exports = {
    getUser,
    getUserWithPosts,
    getUserFriends,
    getFriendsPosts,
    getFriendship
};