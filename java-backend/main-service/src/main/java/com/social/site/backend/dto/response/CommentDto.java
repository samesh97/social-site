package com.social.site.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDto extends BaseDto
{
    private String id;
    private String comment;
    private UserDto user;
}
