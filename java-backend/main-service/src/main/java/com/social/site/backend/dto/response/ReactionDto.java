package com.social.site.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReactionDto extends BaseDto
{
    private String type;
    private UserDto user;
}
