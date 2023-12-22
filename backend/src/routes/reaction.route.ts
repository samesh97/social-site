import { Router } from 'express';
import { User } from "../models/user.model";
import { Reaction } from '../models/reaction.model';
import { response, getSessionInfo, isNullOrEmpty, getCurrentDateTime } from "../utils/common.util";
import { changeScore } from '../utils/friend.util';
import { config } from '../conf/common.conf';
import { getLogger } from '../conf/logger.conf';
const reactionRoute = Router();

reactionRoute.post('/', async (req, res) =>
{
  try
  {
    const { userId } = getSessionInfo(req);
    const { postId, type } = req.body;
    
    if (isNullOrEmpty(postId, type))
    {
        return response(res, "Bad Request!", 400);
    }
    const user = await User.findOne({ where: { id: userId } });
    if (isNullOrEmpty(user))
    {
        return response(res, "Invalid User!", 404);
    }
    const reaction = await Reaction.findOne({ where: { userId: userId, postId: postId } });

    const time = getCurrentDateTime();
    //react for the first time
    if ( isNullOrEmpty(reaction) )
    {
          Reaction.create({
            userId,
            postId,
            type: type,
            createdAt: time,
            updatedAt: time
          });
          changeScore(userId, parseInt(config.FRIEND_SCORE.like));
          return response(res, "Reacted", 201);
    }
    //change reaction type later on
    if (reaction?.type != type)
    {
        reaction?.update({type: type, updatedAt: time});
    }
    else
    {
        //remove reaction
        reaction?.destroy();
    }
    return response(res, 'Reacted', 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Error!", 500);
  }
});

export {
  reactionRoute
}