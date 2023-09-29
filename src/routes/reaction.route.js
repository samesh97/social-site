const { Router } = require('express');
const { User } = require("../models/user.model");
const { Reaction } = require('../models/reaction.model');
const { generateResponse } = require('../dtos/response.dto');
const reactionRoute = Router();

reactionRoute.post('/', async (req, res) => {
    const { userId } = req.body.userInfo;
    const { postId } = req.body;
    const { type } = req.body;
    if (!userId || !postId ) {
      return generateResponse(res, "Bad Request!", 400);
    }
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return generateResponse(res, "Invalid User!", 404);
    }
    const reaction = await Reaction.findOne({ where: { UserId: userId, PostId: postId } });
    //react for the first time
    if ( !reaction )
    {
        await Reaction.create({
          UserId: userId,
          PostId: postId,
          type: type,
        });
        return generateResponse(res, "Reacted", 201);
    }
    //change reaction type later on
    if (reaction.type != type)
    {
        await reaction.update({
          type: type
        });
    }
    else
    {
        //undo reaction
        await reaction.destroy();
    }
    return generateResponse(res, 'Reacted', 201);
});

module.exports = { reactionRoute };