package com.social.site.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostImageDto extends BaseDto
{
    public PostImageDto()
    {
        System.out.println(getClass().getSimpleName());
    }

    private String id;
    private String imageUrl;
}
