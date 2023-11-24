const { Router } = require('express');
const { User } = require("../models/user.model");
const { Reaction } = require('../models/reaction.model');
const { response, getSessionInfo, isNullOrEmpty, getCurrentDateTime } = require("../utils/common.util");
const { changeScore } = require('../utils/friend.util');
const { config } = require('../conf/common.conf');
const { getLogger } = require('../conf/logger.conf');
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
          changeScore(userId, config.FRIEND_SCORE.like);
          return response(res, "Reacted", 201);
    }
    //change reaction type later on
    if (reaction.type != type)
    {
        reaction.update({type: type, updatedAt: time});
    }
    else
    {
        //remove reaction
        reaction.destroy();
    }
    return response(res, 'Reacted', 200);
  }
  catch (error)
  {
    getLogger().error(error);
    return response(res, "Error!", 500);
  }
});

module.exports = { reactionRoute };