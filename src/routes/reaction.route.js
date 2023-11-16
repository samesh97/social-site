const { Router } = require('express');
const { User } = require("../models/user.model");
const { Reaction } = require('../models/reaction.model');
const { response } = require("../utils/common.util");
const reactionRoute = Router();

reactionRoute.post('/', async (req, res) => {
    const { userId } = req.body.userInfo;
    const { postId } = req.body;
    const { type } = req.body;
    if (!userId || !postId ) {
      return response(res, "Bad Request!", 400);
    }
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return response(res, "Invalid User!", 404);
    }
    const reaction = await Reaction.findOne({ where: { UserId: userId, PostId: postId } });
    //react for the first time
    if ( !reaction )
    {
        Reaction.create({
          UserId: userId,
          PostId: postId,
          type: type,
        });
        return response(res, "Reacted", 201);
    }
    //change reaction type later on
    if (reaction.type != type)
    {
        reaction.update({
          type: type
        });
    }
    else
    {
        //undo reaction
        reaction.destroy();
    }
    return response(res, 'Reacted', 201);
});

module.exports = { reactionRoute };