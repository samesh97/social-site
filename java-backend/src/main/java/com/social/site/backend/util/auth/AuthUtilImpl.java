package com.social.site.backend.util.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.mindrot.jbcrypt.BCrypt;

import java.util.UUID;

public class AuthUtilImpl implements AuthUtil
{
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
    public String generateUUID()
    {
        return UUID.randomUUID().toString();
    }

    private static Cookie createCookie(String name, String value, int maxAge )
    {
        Cookie cookie = new Cookie( name, value );
        cookie.setMaxAge( maxAge );
        cookie.setSecure( true );
        cookie.setHttpOnly( true );
        return cookie;
    }
}
