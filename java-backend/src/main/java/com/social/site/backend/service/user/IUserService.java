package com.social.site.backend.service.user;

import com.social.site.backend.dto.response.UserResponse;
import com.social.site.backend.model.User;

import java.util.List;

public interface IUserService
{
    UserResponse save(User user );
    UserResponse findUser( int id );
    List<UserResponse> getAll();

}
