package com.social.site.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProfileViewUserDto
{
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String profileUrl;
    private boolean isVerified;
    private List<PostDto> posts;
    private List<FriendDto> friends;
}
