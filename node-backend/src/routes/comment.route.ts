import { Request, Response, Router } from "express";
import { Comment } from "../models/comment.model";
import { response, isNullOrEmpty, getSessionInfo, getCurrentDateTime } from "../utils/common.util";
import { changeScore } from "../utils/friend.util";
import { config } from "../conf/common.conf";
import { getLogger } from "../conf/logger.conf";
import { getPostComments, sendNotification } from "../utils/db-query.util";
import { Post } from "../models/post.model";

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
            return response(res, "No session info found", 404);    
        }

        const post = await Post.findOne({
            where: {
                id: postId
            }
        });
        if (isNullOrEmpty(post))
        {
            return response(res, "Post not found", 404);    
        }
    
        const time = getCurrentDateTime();
        const commentObj = await Comment.create({
            comment: comment,
            userId: userId,
            postId: postId,
            createdAt: time,
            updatedTime: time
        });
        changeScore(userId, parseInt(config.FRIEND_SCORE.comment));
        sendNotification('Comment', userId, post.UserId, post.id, "Post");
        return response(res, "Success", 201);
    }
    catch (error)
    {
        getLogger().error(error);
        return response(res, "Server side error occured", 500);
    }
});

commentRoute.get("/:postId", async (req: Request, res: Response) =>
{
    try
    {
        const postId = req.params.postId;
        if (isNullOrEmpty(postId))
        {
            return response(res, "No post found", 400);    
        }
        const comments = await getPostComments(postId);
        return response(res, comments, 200);
    }
    catch (error)
    {
        getLogger().error(error);
        return response(res, "Server side error occured", 500);
    }
});

export
{
    commentRoute
}