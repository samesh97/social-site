import { Router } from "express";
import { Comment } from "../models/comment.model";
import { response, isNullOrEmpty, getSessionInfo, getCurrentDateTime } from "../utils/common.util";
import { changeScore } from "../utils/friend.util";
import { config } from "../conf/common.conf";
import { getLogger } from "../conf/logger.conf";

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

export {
    commentRoute
}