package com.social.site.backend.service.user;

import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.dto.payload.UserPayload;
import com.social.site.backend.dto.response.UserResponse;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.mapper.UserMapper;
import com.social.site.backend.model.User;
import com.social.site.backend.repositoy.UserRepository;
import com.social.site.backend.util.CommonUtil;
import com.social.site.backend.util.auth.AuthUtil;
import com.social.site.backend.common.validator.Validator;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService
{
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
    public UserResponse save( UserPayload userPayload ) throws ValidationException, AuthException
    {
        Validator.validate( userPayload );
        User existingUser = userRepository.findByEmail( userPayload.getEmail() );
        if ( !CommonUtil.isNull( existingUser ) )
        {
            throw new ValidationException("Email is already taken.");
        }
        userPayload.setPassword( authUtil.genHash( userPayload.getPassword() ) );
        return userMapper.mapUserResponse( userRepository.save( userMapper.mapToUser( userPayload ) ) );
    }
}
