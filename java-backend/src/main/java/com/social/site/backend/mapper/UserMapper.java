package com.social.site.backend.mapper;

import com.social.site.backend.dto.UserDto;
import com.social.site.backend.model.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper( componentModel = "spring" )
public interface UserMapper
{
    UserDto map(User user );
    List<UserDto> map ( List<User> users );
}
