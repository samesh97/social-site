package com.social.site.backend.mapper;

import com.social.site.backend.dto.response.FriendDto;
import com.social.site.backend.model.Friend;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = BaseMapper.class)
public interface FriendMapper
{
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    FriendDto convert(Friend friend);

    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    List<FriendDto> convert(List<Friend> friends);
}
