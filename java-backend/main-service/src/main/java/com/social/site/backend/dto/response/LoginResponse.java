package com.social.site.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse
{
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String profileUrl;
    private String sessionId;
}
