package com.social.site.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendDto extends BaseDto
{
    private UserDto requestedUser;
    private UserDto acceptedUser;
    private boolean isAccepted;
    private long score;
}
