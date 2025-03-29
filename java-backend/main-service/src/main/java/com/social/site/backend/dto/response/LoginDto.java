package com.social.site.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto extends BaseDto
{
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String profileUrl;
    private String sessionId;
}
