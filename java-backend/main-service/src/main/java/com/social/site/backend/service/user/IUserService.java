package com.social.site.backend.service.user;

import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.dto.payload.UserPayload;
import com.social.site.backend.dto.response.ProfileViewUserDto;
import com.social.site.backend.dto.response.UserDto;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.enums.TokenType;
import com.social.site.backend.model.User;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface IUserService
{
    UserDto save(UserPayload user ) throws ValidationException, AuthException;
    User findUser(String id);
    User getUserFromToken(HttpServletRequest request, TokenType tokenType) throws AuthException;
    List<UserDto> search(String keyword);
    ProfileViewUserDto findUserDto(String id);
}
