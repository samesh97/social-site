import { Router } from 'express';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { response, getSessionInfo, isNullOrEmpty, getCurrentDateTime, getPostScore, getFriendScore } from "../utils/common.util";
import { authentication } from '../utils/auth.util';
import multer from 'multer';
import { uploadMultipleFile } from '../conf/firebase.conf';
import { PostImage } from '../models/post-image.model';
import { getLogger } from '../conf/logger.conf';
import { getUserFriends, getFriendsPosts } from '../utils/db-query.util';

const upload = multer({ storage: multer.memoryStorage() });

const postRoute = Router();

postRoute.post('/', upload.array('post-images', 6), authentication, async (req, res) =>
{
  try
  {
    const { userId } = getSessionInfo(req);
    const { description } = req.body;
  
    let imageList: any = await uploadMultipleFile(req, 'posts');

    const time = getCurrentDateTime();
    imageList = imageList.map((item: any) => {
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
  
    const user: any = await User.findOne({ where: { id: userId } });
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

postRoute.get('/', async (req, res) =>
{
  try
  {
    const { userId } = getSessionInfo(req);
    if (isNullOrEmpty(userId))
    {
      return response(res, "No valid session found", 400);  
    }

    const friends = await getUserFriends(userId, true);

    //get user's friend's userIds
    const frienUserIds = friends.map((friend: any) => {
      return friend.requestedUserId == userId ? friend.acceptedUserId : friend.requestedUserId
    });

    //load own user posts
    frienUserIds.push(userId);

    const posts: any = await getFriendsPosts(frienUserIds);    
    
    const postsWithScore = posts.map((post: any) =>
    {
      const postUserId = post.User.id;
      const friendship: any = friends.filter((item: any) => item.acceptedUserId == postUserId || item.requestedUserId == postUserId)[0];
      const score = getFriendScore(friendship.score, friendship.createdAt);
      post.score = getPostScore(score, post.createdAt);
      return post;
    });

    const orderedPosts = postsWithScore.sort((a: any, b: any) => b.score - a.score);
    return response(res, orderedPosts, 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Error!", 500);
  }
});

export {
  postRoute
}