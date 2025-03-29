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
public class PostImage extends BaseModel
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
}
