package com.social.site.backend.service.user;

import com.social.site.backend.dto.payload.UserPayload;
import com.social.site.backend.dto.response.UserResponse;
import com.social.site.backend.exception.ValidationException;
import com.social.site.backend.mapper.UserMapper;
import com.social.site.backend.model.User;
import com.social.site.backend.repositoy.UserRepository;
import com.social.site.backend.util.CommonUtil;
import com.social.site.backend.util.auth.AuthUtil;
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
    private final AuthUtil authUtil;

    public UserService(UserRepository userRepository, UserMapper userMapper, AuthUtil authUtil )
    {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.authUtil = authUtil;
    }

    @Override
    public UserResponse save( UserPayload userPayload ) throws ValidationException
    {
        Validator.validate( userPayload );
        userPayload.setPassword( authUtil.genHash( userPayload.getPassword() ) );
        User existingUser = userRepository.findByEmail( userPayload.getEmail() );
        if ( !CommonUtil.isNull( existingUser ) )
        {
            throw new ValidationException("Email is already taken.");
        }
        return userMapper.mapUserResponse( userRepository.save( userMapper.mapToUser( userPayload ) ) );
    }
}
