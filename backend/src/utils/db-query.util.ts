import { Op, Sequelize } from "sequelize";

import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import { Reaction } from '../models/reaction.model';
import { PostImage } from '../models/post-image.model';
import { Comment } from '../models/comment.model';
import { Friend } from '../models/friend.model';

const userAttributes = ['id', 'firstName', 'lastName', 'profileUrl'];
const postAttributes = ['id', 'description', 'createdAt', 'updatedAt'];
const commentAttributes = ['id', 'description', 'createdAt', 'updatedAt'];
const postImageAttributes = ['id', 'imageUrl'];
const friendAttributes = ['requestedUser', 'acceptedUser', 'isAccepted','score','createdAt','updatedAt'];


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

export {
    getUser,
    getUserWithPosts,
    getUserFriends,
    getFriendsPosts,
    getFriendship
};