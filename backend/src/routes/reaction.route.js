const { Router } = require('express');
const { User } = require("../models/user.model");
const { Reaction } = require('../models/reaction.model');
const { response, getSessionInfo, isNullOrEmpty } = require("../utils/common.util");
const reactionRoute = Router();

reactionRoute.post('/', async (req, res) =>
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
  //react for the first time
  if ( isNullOrEmpty(reaction) )
  {
        Reaction.create({
          userId,
          postId,
          type: type,
        });
        return response(res, "Reacted", 201);
  }
  //change reaction type later on
  if (reaction.type != type)
  {
      reaction.update({type: type});
  }
  else
  {
      //remove reaction
      reaction.destroy();
  }
  return response(res, 'Reacted', 200);
});

module.exports = { reactionRoute };