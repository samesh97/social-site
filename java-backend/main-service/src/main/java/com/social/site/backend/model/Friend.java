package com.social.site.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Friend extends BaseModel
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private boolean isAccepted;
    private long score;

    @ManyToOne
    @JoinColumn(name = "requestedUser_id")
    private User requestedUser;

    @ManyToOne
    @JoinColumn(name = "acceptedUser_id")
    private User acceptedUser;
}
