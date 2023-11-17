const { Router } = require("express");
const { Comment } = require("../models/comment.model");
const { response, isNullOrEmpty, getSessionInfo } = require("../utils/common.util");

const commentRoute = Router();

commentRoute.post("/", async (req, res) =>
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

    await Comment.create({
        comment: comment,
        userId: userId,
        postId: postId
    });
    return response(res, "Commented", 201);
});


module.exports = { commentRoute };