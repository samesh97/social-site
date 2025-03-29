package com.social.site.backend.service.reaction;

import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.validator.Validator;
import com.social.site.backend.dto.payload.ReactionPayload;
import com.social.site.backend.model.Post;
import com.social.site.backend.model.Reaction;
import com.social.site.backend.model.User;
import com.social.site.backend.repositoy.ReactionRepository;
import com.social.site.backend.service.post.PostService;
import com.social.site.backend.service.user.UserService;
import com.social.site.backend.util.CommonUtil;
import org.springframework.stereotype.Service;

@Service
public class ReactionService implements IReactionService
{
    private final ReactionRepository repository;
    private final UserService userService;
    private final PostService postService;

    public ReactionService(ReactionRepository repository, UserService userService, PostService postService)
    {
        this.repository = repository;
        this.userService = userService;
        this.postService = postService;
    }

    @Override
    public Reaction save(ReactionPayload payload) throws ValidationException
    {
        Validator.validate(payload);

        User user = userService.findUser(payload.getUserId());
        Post post = postService.findPost(payload.getPostId());

        if(CommonUtil.isNull(user))
        {
            throw new ValidationException("The user cannot be null.");
        }
        if(CommonUtil.isNull(post))
        {
            throw new ValidationException("The post cannot be null.");
        }

        Reaction existingReaction = repository.findReactionByPostAndUser(post.getId(), user.getId());

        if(CommonUtil.isNull(existingReaction))
        {
            //react
            Reaction reaction = new Reaction(post,user);
            reaction.setType(payload.getType());
            return this.repository.save(reaction);
        }

        //delete reaction
        repository.delete(existingReaction);
        return null;
    }
}
