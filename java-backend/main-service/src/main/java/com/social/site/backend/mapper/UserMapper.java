package com.social.site.backend.mapper;

import com.social.site.backend.dto.payload.UserPayload;
import com.social.site.backend.dto.response.LoginDto;
import com.social.site.backend.dto.response.ProfileViewUserDto;
import com.social.site.backend.dto.response.UserDto;
import com.social.site.backend.model.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper( componentModel = "spring" )
public interface UserMapper
{
    UserPayload map( User user );
    List<UserPayload> map (List<User> users );
    UserDto mapUserResponse(User user );
    User mapToUser( UserPayload userPayload );
    LoginDto mapToLoginResponse(User user);
    List<UserDto> mapUserDto (List<User> users );
    ProfileViewUserDto mapProfileViewUserDto(User user);
}
