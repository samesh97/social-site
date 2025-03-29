package com.social.site.backend.dto.payload;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendRequestActionPayload
{
    private String userId;
    private boolean accepted;
}
