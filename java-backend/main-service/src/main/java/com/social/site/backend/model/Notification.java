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
public class Notification extends BaseModel
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String type;
    private boolean hasSeen;

    @ManyToOne
    @JoinColumn(name = "initiatedUser_id")
    private User initiatedUser;

    @ManyToOne
    @JoinColumn(name = "targetUser_id")
    private User targetUser;

    private String targetId;
    private String targetType;

}
