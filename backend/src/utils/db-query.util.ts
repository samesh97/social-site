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
const friendAttributes = ['requestedUserId', 'acceptedUserId', 'isAccepted', 'score', 'createdAt', 'updatedAt'];


const getUser = async (userId: string) =>
{
    return await User.findOne({
        where: { id: userId },
        attributes: userAttributes
    });
}
const getUserWithPosts = async (userId: string) =>
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
        ],
        order: [
          [ Post, 'createdAt', 'DESC' ],
          [ Post, Comment, 'createdAt', 'DESC' ]
        ]
      });
}

const getUserFriends = async (userId: string, ...accepted: boolean []) =>
{
    return await Friend.findAll({
      attributes: friendAttributes,
      where:
      {
          [Op.or]:
          [
              {
                requestedUserId: userId,
                isAccepted: accepted
              },
              {
                acceptedUserId: userId,
                isAccepted: accepted
              }
          ]
      }
      });
}

const getFriendship = async (userId1: string, userId2: string) =>
{
    return await Friend.findOne({
      attributes: friendAttributes,
      where: {
          [Op.and]:
            [
              {
                requestedUserId: [userId1, userId2],
              },
              {
                acceptedUserId: [userId1, userId2]
              }
            ],
        }
      });
}

const getFriendsPosts = async (friendsIds: string []) => {
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
      ],
      order: [
        [ Comment, 'createdAt', 'DESC']
      ]
    });
}

const getPostComments = async (postId: string) => {
  return await Comment.findAll({
    where: {
        postId
    },
    include:
      [
        {
          model: User,
          attributes: userAttributes
        }
      ],
    order: [
      ['createdAt', 'DESC']
    ]
  });
}

const getFriendRequests = async (userId: string) => 
{
  return await Friend.findAll({
    where: {
      acceptedUserId: userId,
      isAccepted: false,
    },
    attributes: friendAttributes,
    include: [
      {
        model: User,
        as: 'requestedUser',
        attributes: userAttributes
      },
      {
        model: User,
        as: 'acceptedUser',
        attributes: userAttributes
      }
    ]
  });
}

const searchUser = async (...keywords: string []) => {
  return await User.findAll({
    where: {
      [Op.or]:
      [
        {
          firstName: { [Op.startsWith]: keywords }
        },
        {
          lastName: { [Op.startsWith]: keywords }  
        }
      ]
    },
    attributes: userAttributes
  });
}

export {
    getUser,
    getUserWithPosts,
    getUserFriends,
    getFriendsPosts,
    getFriendship,
    getPostComments,
    getFriendRequests,
    searchUser
};