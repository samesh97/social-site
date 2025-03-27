package com.social.site.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Post
{
    private String id;
    private String description;
    List<PostImage> postImages;
    private User user;
}
