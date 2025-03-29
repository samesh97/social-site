package com.social.site.backend.model;

import com.social.site.backend.model.key.ReactionKey;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Reaction extends BaseModel
{
    @EmbeddedId
    private ReactionKey id;

    private String type;

    @ManyToOne
    @MapsId("userId")
    private User user;

    @ManyToOne
    @MapsId("postId")
    private Post post;

    public Reaction() {}

    public Reaction(Post post, User user)
    {
        this.user = user;
        this.post = post;
        this.id = new ReactionKey(post,user);
    }

}
