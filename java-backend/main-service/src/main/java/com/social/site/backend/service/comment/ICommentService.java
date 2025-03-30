package com.social.site.backend.service.comment;

import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.dto.payload.CommentPayload;
import com.social.site.backend.dto.response.CommentDto;
import com.social.site.backend.model.Comment;

import java.util.List;

public interface ICommentService
{
    Comment save(CommentPayload commentPayload) throws ValidationException;
    List<CommentDto> fetchPostComments(String postId) throws ValidationException;
}
