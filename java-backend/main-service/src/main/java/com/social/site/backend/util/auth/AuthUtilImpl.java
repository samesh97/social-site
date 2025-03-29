package com.social.site.backend.util.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.social.site.backend.common.Constants;
import com.social.site.backend.enums.TokenType;
import com.social.site.backend.model.Token;
import com.social.site.backend.model.User;
import com.social.site.backend.service.token.ITokenService;
import com.social.site.backend.util.CommonUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

import static com.social.site.backend.common.Constants.JWT_TOKEN_PAYLOAD_USER_ID;

@Component
public class AuthUtilImpl implements AuthUtil
{
    private final ITokenService tokenService;
    private final Algorithm jwtAccessTokenSignAlgorithm;
    private final Algorithm jwtRefreshTokenSignAlgorithm;

    public AuthUtilImpl(ITokenService tokenService,
                        @Qualifier(value = Constants.JWT_ACCESS_TOKEN_ALGORITHM) Algorithm jwtAccessTokenSignAlgorithm,
                        @Qualifier(value = Constants.JWT_REFRESH_TOKEN_ALGORITHM) Algorithm jwtRefreshTokenSignAlgorithm)
    {
        this.tokenService = tokenService;
        this.jwtAccessTokenSignAlgorithm = jwtAccessTokenSignAlgorithm;
        this.jwtRefreshTokenSignAlgorithm = jwtRefreshTokenSignAlgorithm;
    }

    @Override
    public String genHash( String plainPassword )
    {
        return  BCrypt.hashpw( plainPassword, BCrypt.gensalt() );
    }

    @Override
    public boolean verifyHash( String plainPassword, String hashedPassword )
    {
        return BCrypt.checkpw( plainPassword, hashedPassword );
    }

    @Override
    public void setHttpCookie( HttpServletResponse response, String name, String value, int maxAge )
    {
        Cookie cookie = createCookie( name, value, maxAge );
        response.addCookie( cookie );
    }

    @Override
    public String getCookie( HttpServletRequest request, String cookieName )
    {
        if(CommonUtil.isNull(request.getCookies()))
        {
            return null;
        }
        Cookie cookieOpt = Arrays.stream( request.getCookies() )
                                 .filter( cookie -> cookieName.equals( cookie.getName() ))
                                 .findFirst()
                                 .orElse( null );
        if( CommonUtil.isNull( cookieOpt ) )
        {
            return null;
        }
        return cookieOpt.getValue();
    }

    @Override
    public String generateUUID()
    {
        return UUID.randomUUID().toString();
    }

    @Override
    public Token generateAccessToken(User user, String sessionId)
    {
        String accessToken = generateToken(user, TokenType.ACCESS_TOKEN);
        return tokenService.createAccessToken(user,accessToken,sessionId);
    }

    @Override
    public Token generateRefreshToken(User user)
    {
        String refreshToken = generateToken(user, TokenType.REFRESH_TOKEN);
        return tokenService.createRefreshToken(user,refreshToken);
    }

    private Algorithm getSigningAlgorithm(TokenType tokenType)
    {
        return TokenType.ACCESS_TOKEN == tokenType ? jwtAccessTokenSignAlgorithm :
                        jwtRefreshTokenSignAlgorithm;
    }

    @Override
    public String generateToken(User user, TokenType tokenType)
    {
        return JWT.create()
                .withIssuedAt(new Date())
                .withClaim(JWT_TOKEN_PAYLOAD_USER_ID,user.getId())
                .sign(getSigningAlgorithm(tokenType));
    }

    @Override
    public DecodedJWT verifyToken(String token, TokenType tokenType)
    {
        try
        {
            return JWT.require(getSigningAlgorithm(tokenType))
                                       .build()
                                       .verify(token);
        }
        catch (JWTVerificationException e)
        {
            return null;
        }
    }

    @Override
    public void deleteToken(String token)
    {
        tokenService.deleteToken(token);
    }

    private static Cookie createCookie(String name, String value, int maxAge )
    {
        Cookie cookie = new Cookie( name, value );
        cookie.setMaxAge( maxAge );
        cookie.setPath("/");
        cookie.setSecure( true );
        cookie.setHttpOnly( true );
        cookie.setAttribute("SameSite", "Strict");
        return cookie;
    }
}
