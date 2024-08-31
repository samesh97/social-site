package com.social.site.backend.service.user;

import com.social.site.backend.dto.response.UserResponse;
import com.social.site.backend.exception.ValidationException;
import com.social.site.backend.mapper.UserMapper;
import com.social.site.backend.model.User;
import com.social.site.backend.repositoy.UserRepository;
import com.social.site.backend.util.CommonUtil;
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
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper )
    {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserResponse save(User user )
    {
        Validator.validate( user );
        User existingUser = userRepository.findByEmail( user.getEmail() );
        if ( !CommonUtil.isNull( existingUser ) )
        {
            throw new ValidationException("Email is already taken.");
        }
        return userMapper.mapUserResponse( userRepository.save( user ) );
    }

    @Override
    public UserResponse findUser( int id )
    {
        Optional<User> userOptional = userRepository.findById( id );
        if( userOptional.isPresent() )
        {
            return userMapper.mapUserResponse( userOptional.get() );
        }
        throw new ValidationException("User not found.");
    }

    @Override
    public List<UserResponse> getAll()
    {
        List<UserResponse> users = new ArrayList<>();
        for ( User user : userRepository.findAll() )
        {
            users.add( userMapper.mapUserResponse( user ));
        }
        return users;
    }
}
