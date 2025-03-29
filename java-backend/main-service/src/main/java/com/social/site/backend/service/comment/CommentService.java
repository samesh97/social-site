package com.social.site.backend.service.comment;

import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.validator.Validator;
import com.social.site.backend.dto.payload.CommentPayload;
import com.social.site.backend.model.Comment;
import com.social.site.backend.model.Post;
import com.social.site.backend.model.User;
import com.social.site.backend.repositoy.CommentRepository;
import com.social.site.backend.service.post.IPostService;
import com.social.site.backend.service.user.IUserService;
import com.social.site.backend.util.CommonUtil;
import org.springframework.stereotype.Service;

@Service
public class CommentService implements ICommentService
{
    private final CommentRepository commentRepository;
    private final IUserService userService;
    private final IPostService postService;

    public CommentService(CommentRepository commentRepository, IUserService userService, IPostService postService)
    {
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.postService = postService;
    }

    @Override
    public Comment save(CommentPayload commentPayload) throws ValidationException
    {
        Validator.validate(commentPayload);

        User user = userService.findUser(commentPayload.getUserId());
        Post post = postService.findPost(commentPayload.getPostId());

        if(CommonUtil.isNull(user))
        {
            throw new ValidationException("User not found!");
        }

        if(CommonUtil.isNull(post))
        {
            throw new ValidationException("Post not found!");
        }

        Comment comment = new Comment();
        comment.setComment(commentPayload.getComment());
        comment.setPost(post);
        comment.setUser(user);

        return commentRepository.save(comment);
    }
}
