package com.social.site.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto extends BaseDto
{
    private String id;
    private String firstName;
    private String lastName;
    private String profileUrl;
}
