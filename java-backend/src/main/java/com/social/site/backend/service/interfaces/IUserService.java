package com.social.site.backend.service.interfaces;

import com.social.site.backend.model.User;

import java.util.List;

public interface IUserService
{
    void save( User user );
    User findUser( int id );
    List<User> getAll();

}
