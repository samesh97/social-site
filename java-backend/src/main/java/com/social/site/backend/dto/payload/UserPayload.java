package com.social.site.backend.dto.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserPayload
{
    private int id;
    private String email;
    private String firstName;
    private String lastName;
    private String profileUrl;
}
