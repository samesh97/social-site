package com.social.site.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse
{
    private String email;
    private String firstName;
    private String lastName;
    private String profileUrl;
}
