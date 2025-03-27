package com.social.site.backend.util.auth;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.social.site.backend.enums.TokenType;
import com.social.site.backend.model.Token;
import com.social.site.backend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthUtil
{
    String [] bypassAuthUrls = new String[]{
            "auth/login/",
            "auth/refresh/",
            "users/"
    };

    String genHash( String plainPassword );
    boolean verifyHash( String plainPassword, String hashedPassword );
    void setHttpCookie(HttpServletResponse response, String name, String value, int maxAge );
    String getCookie( HttpServletRequest request, String cookieName );
    String generateUUID();
    Token generateAccessToken(User user, String sessionId);
    Token generateRefreshToken(User user);
    String generateToken(User user, TokenType tokenType);
    DecodedJWT verifyToken(String token, TokenType tokenType);
    void deleteToken(String token);
}
