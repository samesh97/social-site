package com.social.site.backend.mapper;

import com.social.site.backend.dto.response.CommentDto;
import com.social.site.backend.model.Comment;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CommentMapper
{
    CommentDto map(Comment comment);
    List<CommentDto> mapList(List<Comment> comments);
}
