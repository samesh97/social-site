package com.social.site.backend.model.key;

import com.social.site.backend.model.User;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Embeddable
@Getter
@Setter
public class FriendKey
{
    private String requestedUserId;
    private String acceptedUserId;

    public FriendKey() {}

    public FriendKey(User requestedUser, User acceptedUser)
    {
        this.requestedUserId = requestedUser.getId();
        this.acceptedUserId = acceptedUser.getId();
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FriendKey friendKey = (FriendKey) o;
        return Objects.equals(requestedUserId, friendKey.requestedUserId) && Objects.equals(acceptedUserId, friendKey.acceptedUserId);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(requestedUserId, acceptedUserId);
    }
}
