package com.social.site.backend.service.auth;

import com.social.site.backend.exception.ValidationException;
import com.social.site.backend.exception.auth.AuthException;
import com.social.site.backend.model.User;
import com.social.site.backend.dto.payload.LoginPayload;
import com.social.site.backend.repositoy.UserRepository;
import com.social.site.backend.util.CommonUtil;
import com.social.site.backend.util.auth.AuthUtil;
import com.social.site.backend.validator.Validator;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;


@Service
public class AuthService implements IAuthService
{
    private final UserRepository userRepository;
    private final AuthUtil authUtil;

    public AuthService( UserRepository userRepository, AuthUtil authUtil  )
    {
        this.userRepository = userRepository;
        this.authUtil = authUtil;
    }

    @Override
    public void login( LoginPayload payload, HttpServletResponse response ) throws ValidationException, AuthException
    {
        Validator.validate( payload );
        User user = userRepository.findByEmail( payload.getEmail() );

        if( CommonUtil.isNull( user ) )
        {
            throw new ValidationException( "No user found with username password combination." );
        }

        if( !authUtil.verifyHash( payload.getPassword(), user.getPassword() ) )
        {
            throw new AuthException( "No user found with username password combination." );
        }

        String accessToken = authUtil.generateUUID();
        authUtil.setHttpCookie( response, "at", accessToken, 3600 );
    }
}
