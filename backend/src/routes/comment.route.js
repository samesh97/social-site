const { Router } = require("express");
const { Comment } = require("../models/comment.model");
const { response, isNullOrEmpty, getSessionInfo, getCurrentDateTime } = require("../utils/common.util");
const { changeScore } = require("../utils/friend.util");
const { config } = require("../conf/common.conf");
const { getLogger } = require("../conf/logger.conf");

const commentRoute = Router();

commentRoute.post("/", async (req, res) =>
{
    try
    {
        const { comment, postId } = req.body;
        if (isNullOrEmpty(comment, postId))
        {
            return response(res, "Bad request", 400);    
        }
        const { userId } = getSessionInfo(req);
        if (isNullOrEmpty(userId))
        {
            return response(res, "No user found!", 404);    
        }
    
        const time = getCurrentDateTime();
        await Comment.create({
            comment: comment,
            userId: userId,
            postId: postId,
            createdAt: time,
            updatedTime: time
        });
        changeScore(userId, config.FRIEND_SCORE.comment);
        return response(res, "Commented", 201);
    }
    catch (error)
    {
        getLogger().error(error);
        return response(res, "Error!", 500);
    }
});


module.exports = { commentRoute };