package com.social.site.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostImageDto extends BaseDto
{
    private String id;
    private String imageUrl;
}
