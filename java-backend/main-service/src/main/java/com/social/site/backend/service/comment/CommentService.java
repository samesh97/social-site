package com.social.site.backend.service.comment;

import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.validator.Validator;
import com.social.site.backend.dto.payload.CommentPayload;
import com.social.site.backend.dto.response.CommentDto;
import com.social.site.backend.mapper.CommentMapper;
import com.social.site.backend.model.Comment;
import com.social.site.backend.model.Post;
import com.social.site.backend.model.User;
import com.social.site.backend.repositoy.CommentRepository;
import com.social.site.backend.service.post.IPostService;
import com.social.site.backend.service.user.IUserService;
import com.social.site.backend.util.CommonUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService implements ICommentService
{
    private final CommentRepository commentRepository;
    private final IUserService userService;
    private final IPostService postService;
    private final CommentMapper commentMapper;

    public CommentService(CommentRepository commentRepository, IUserService userService, IPostService postService, CommentMapper commentMapper)
    {
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.postService = postService;
        this.commentMapper = commentMapper;
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

    @Override
    public List<CommentDto> fetchPostComments(String postId) throws ValidationException
    {
        if(CommonUtil.isNullOrEmpty(postId))
        {
            throw new ValidationException("PostId cannot be null or empty");
        }
        List<Comment> comments = commentRepository.getPostComments(postId);
        return commentMapper.mapList(comments);
    }
}
