package com.social.site.backend.service;

import com.social.site.backend.model.User;
import com.social.site.backend.repositoy.UserRepository;
import com.social.site.backend.service.interfaces.IUserService;
import com.social.site.backend.validator.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService
{
    @Autowired
    private UserRepository userRepository;

    @Override
    public void save( User user )
    {
        Validator.validate( user );
        userRepository.save( user );
    }

    @Override
    public User findUser( int id )
    {
        Optional<User> userOptional = userRepository.findById( id );
        if( userOptional.isPresent() )
        {
            return userOptional.get();
        }
        throw new RuntimeException("User not found.");
    }

    @Override
    public List<User> getAll()
    {
        List<User> users = new ArrayList<>();
        for (User user : userRepository.findAll()) {
            users.add(user);
        }
        return users;
    }
}
