package com.social.site.backend.service.reaction;

import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.dto.payload.ReactionPayload;
import com.social.site.backend.model.Reaction;

public interface IReactionService
{
    Reaction save(ReactionPayload payload) throws ValidationException;
}
