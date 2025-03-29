package com.social.site.backend.service.comment;

import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.dto.payload.CommentPayload;
import com.social.site.backend.model.Comment;

public interface ICommentService
{
    Comment save(CommentPayload commentPayload) throws ValidationException;
}
