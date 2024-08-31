package com.social.site.backend.service;

import com.social.site.backend.dto.Response;
import com.social.site.backend.dto.UserDto;
import com.social.site.backend.enums.HttpStatusCode;
import com.social.site.backend.exception.ValidationException;
import com.social.site.backend.model.User;
import com.social.site.backend.payload.LoginPayload;
import com.social.site.backend.repositoy.UserRepository;
import com.social.site.backend.service.interfaces.IAuthService;
import com.social.site.backend.util.AuthUtil;
import com.social.site.backend.util.CommonUtil;
import com.social.site.backend.validator.Validator;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import static com.social.site.backend.util.AuthUtil.generateUUID;
import static com.social.site.backend.util.AuthUtil.setCookie;

@Service
public class AuthService implements IAuthService
{
    private final UserRepository userRepository;

    public AuthService( UserRepository userRepository )
    {
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<Response<UserDto>> login( LoginPayload payload, HttpServletResponse response )
    {
        try
        {
            Validator.validate( payload );

            User user = userRepository.findByEmail( payload.getEmail() );
            if( CommonUtil.isNull( user ) )
            {
                return Response.wrap( HttpStatusCode.NOT_FOUND, null, "No user found with username password combination." );
            }

            if( !AuthUtil.isHashMatching( user.getPassword(), payload.getPassword() ) )
            {
                return Response.wrap( HttpStatusCode.NOT_FOUND, null, "No user found with username password combination." );
            }

            String accessToken = generateUUID();
            setCookie( response, "at", accessToken, 3600 );

            return Response.wrap( HttpStatusCode.SUCCESS,"Login success." );
        }
        catch ( ValidationException e )
        {
            return Response.wrap( HttpStatusCode.BAD_REQUEST, e.getMessage() );
        }
    }
}
