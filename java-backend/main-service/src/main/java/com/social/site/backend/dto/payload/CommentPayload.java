package com.social.site.backend.dto.payload;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentPayload
{
    @NotNull(message = "Comment cannot be null or empty.")
    @NotEmpty(message = "Comment cannot be null or empty.")
    private String comment;

    @NotNull(message = "PostId cannot be null or empty.")
    @NotEmpty(message = "PostId cannot be null or empty.")
    private String postId;

    @NotNull(message = "UserId cannot be null or empty.")
    @NotEmpty(message = "UserId cannot be null or empty.")
    private String userId;
}
