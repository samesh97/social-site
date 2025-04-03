package com.social.site.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Getter
@Setter
@Table( name = "user_data")
public class User extends BaseModel
{
    @Id
    @GeneratedValue( strategy = GenerationType.UUID )
    private String id;

    @Column( unique = true )
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private boolean isVerified = false;
    private String profileUrl;
    private String coverUrl;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Token> tokens;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Reaction> reactions;

    @OneToMany(mappedBy = "targetUser", cascade = CascadeType.ALL)
    private List<Notification> notifications;

    @OneToMany(mappedBy = "initiatedUser", cascade = CascadeType.ALL)
    private List<Notification> sentNotifications;

    @OneToMany(mappedBy = "requestedUser", cascade = CascadeType.ALL)
    private List<Friend> sentFriendRequests;

    @OneToMany(mappedBy = "acceptedUser", cascade = CascadeType.ALL)
    private List<Friend> receivedFriendRequests;

}
