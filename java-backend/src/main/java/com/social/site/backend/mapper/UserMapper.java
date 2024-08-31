package com.social.site.backend.mapper;

import com.social.site.backend.dto.payload.UserPayload;
import com.social.site.backend.dto.response.UserResponse;
import com.social.site.backend.model.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper( componentModel = "spring" )
public interface UserMapper
{
    UserPayload map( User user );
    List<UserPayload> map (List<User> users );
    UserResponse mapUserResponse( User user );
}
