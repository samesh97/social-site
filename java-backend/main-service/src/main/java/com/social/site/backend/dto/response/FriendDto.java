package com.social.site.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendDto extends BaseDto
{
    private boolean isAccepted;
    private long score;

    private UserDto requestedUser;
    private UserDto acceptedUser;
}
