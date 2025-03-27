package com.social.site.backend.service.auth;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.dto.response.LoginResponse;
import com.social.site.backend.dto.response.TokenRefreshResponse;
import com.social.site.backend.enums.TokenType;
import com.social.site.backend.model.Token;
import com.social.site.backend.model.User;
import com.social.site.backend.dto.payload.LoginPayload;
import com.social.site.backend.repositoy.UserRepository;
import com.social.site.backend.util.CommonUtil;
import com.social.site.backend.util.auth.AuthUtil;
import com.social.site.backend.common.validator.Validator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import static com.social.site.backend.common.Constants.ACCESS_TOKEN_COOKIE_NAME;
import static com.social.site.backend.common.Constants.JWT_TOKEN_PAYLOAD_USER_ID;
import static com.social.site.backend.common.Constants.REFRESH_TOKEN_COOKIE_NAME;


@Service
public class AuthService implements IAuthService
{
    private final UserRepository userRepository;
    private final AuthUtil authUtil;

    public AuthService( UserRepository userRepository, AuthUtil authUtil )
    {
        this.userRepository = userRepository;
        this.authUtil = authUtil;
    }

    @Override
    public LoginResponse login(LoginPayload payload, HttpServletResponse response ) throws ValidationException, AuthException
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

        String sessionId = authUtil.generateUUID();
        Token accessToken = authUtil.generateAccessToken(user,sessionId);
        Token refreshToken = authUtil.generateRefreshToken(user);

        setAccessTokenCookie(response,accessToken.getToken());
        setRefreshTokenCookie(response, refreshToken.getToken());

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setId(user.getId());
        loginResponse.setEmail(user.getEmail());
        loginResponse.setFirstName(user.getFirstName());
        loginResponse.setLastName(user.getLastName());
        loginResponse.setProfileUrl(user.getProfileUrl());
        loginResponse.setSessionId(sessionId);
        return loginResponse;
    }

    @Override
    public void logout( HttpServletRequest request, HttpServletResponse response ) throws ValidationException, AuthException
    {
        String accessTokenCookieValue = authUtil.getCookie( request, ACCESS_TOKEN_COOKIE_NAME );
        if( CommonUtil.isNull( accessTokenCookieValue ) )
        {
            throw new AuthException("Access token is not found!");
        }
        boolean isTokenValid = authUtil.verifyToken(accessTokenCookieValue, TokenType.ACCESS_TOKEN) != null;
        if(!isTokenValid)
        {
            throw new AuthException("Invalid access token!");
        }
        authUtil.deleteToken(accessTokenCookieValue);
        deleteAllCookies(response);
    }

    @Override
    public TokenRefreshResponse refresh(HttpServletRequest request,HttpServletResponse response) throws ValidationException, AuthException
    {
        String refreshToken = authUtil.getCookie(request, REFRESH_TOKEN_COOKIE_NAME);
        if(CommonUtil.isNull(refreshToken))
        {
            throw new AuthException("No refresh token found!");
        }

        DecodedJWT decodedJWT = authUtil.verifyToken(refreshToken, TokenType.REFRESH_TOKEN);
        if(CommonUtil.isNull(decodedJWT))
        {
            throw new AuthException("Invalid refresh token.");
        }

        String userId = decodedJWT.getClaim(JWT_TOKEN_PAYLOAD_USER_ID).asString();
        User user = userRepository.findById(userId);

        if(CommonUtil.isNull(user))
        {
            throw new ValidationException("User associated with refresh token not found!");
        }

        String sessionId = authUtil.generateUUID();
        Token accessToken = authUtil.generateAccessToken(user,sessionId);

        setAccessTokenCookie(response, accessToken.getToken());

        TokenRefreshResponse tokenRefreshResponse = new TokenRefreshResponse();
        tokenRefreshResponse.setSessionId(sessionId);
        return tokenRefreshResponse;
    }

    private void deleteAllCookies(HttpServletResponse response)
    {
        authUtil.setHttpCookie( response, ACCESS_TOKEN_COOKIE_NAME, null, 0 );
        authUtil.setHttpCookie( response, REFRESH_TOKEN_COOKIE_NAME, null, 0 );
    }

    private void setAccessTokenCookie(HttpServletResponse response, String token)
    {
        authUtil.setHttpCookie( response, ACCESS_TOKEN_COOKIE_NAME, token, 60 * 5 );
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String token)
    {
        authUtil.setHttpCookie( response, REFRESH_TOKEN_COOKIE_NAME, token, 60 * 60 * 24 * 30 * 3 );
    }
}
