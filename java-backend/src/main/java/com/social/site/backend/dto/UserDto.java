package com.social.site.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto
{
    private int id;
    private String email;
    private String firstName;
    private String lastName;
    private String profileUrl;
}
