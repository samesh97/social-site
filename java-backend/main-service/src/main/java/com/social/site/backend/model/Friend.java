package com.social.site.backend.model;

import com.social.site.backend.model.key.FriendKey;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Friend extends BaseModel
{
    @EmbeddedId
    private FriendKey id;

    private boolean isAccepted;
    private long score;

    @ManyToOne
    @MapsId("requestedUserId")
    private User requestedUser;

    @ManyToOne
    @MapsId("acceptedUserId")
    private User acceptedUser;

    public Friend() {}

    public Friend(User requestedUser,User acceptedUser)
    {
        this.requestedUser = requestedUser;
        this.acceptedUser = acceptedUser;
        this.id = new FriendKey(requestedUser, acceptedUser);
    }
}
