package com.social.site.backend.dto.response;


import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class PostDto extends BaseDto
{
    private String id;
    private String description;
    private UserDto user;
    private List<CommentDto> comments = new ArrayList<>();
    List<ReactionDto> reactions = new ArrayList<>();
    private List<PostImageDto> postImages = new ArrayList<>();
}
