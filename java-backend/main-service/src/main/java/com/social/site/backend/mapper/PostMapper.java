package com.social.site.backend.mapper;

import com.social.site.backend.dto.response.PostDto;
import com.social.site.backend.model.Post;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring",uses = BaseMapper.class)
public interface PostMapper
{
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    PostDto convert(Post post);

    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    List<PostDto> convert(List<Post> posts);

    @InheritInverseConfiguration
    Post toEntity(PostDto postDTO);
}
