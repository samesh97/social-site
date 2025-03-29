package com.social.site.backend.model.key;

import com.social.site.backend.model.Post;
import com.social.site.backend.model.User;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Embeddable
@Getter
@Setter
public class ReactionKey
{
    private String userId;
    private String postId;

    public ReactionKey() {}

    public ReactionKey(Post post, User user)
    {
        this.userId = user.getId();
        this.postId = post.getId();
    }

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReactionKey that = (ReactionKey) o;
        return Objects.equals(userId, that.userId) && Objects.equals(postId, that.postId);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(userId, postId);
    }
}
