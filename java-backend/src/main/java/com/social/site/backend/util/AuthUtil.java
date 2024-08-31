package com.social.site.backend.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.mindrot.jbcrypt.BCrypt;

import java.util.UUID;

public class AuthUtil
{
    public static String hashPassword( String plainPassword )
    {
        return  BCrypt.hashpw( plainPassword, BCrypt.gensalt() );
    }

    public static boolean isHashMatching( String hashedPasswordToCheck, String plainPassword )
    {
        return BCrypt.checkpw( plainPassword, hashedPasswordToCheck );
    }

    public static void setCookie( HttpServletResponse response, String name, String value, int maxAge )
    {
        Cookie cookie = createCookie( name, value, maxAge );
        response.addCookie( cookie );
    }

    private static Cookie createCookie( String name, String value, int maxAge )
    {
        Cookie cookie = new Cookie( name, value );
        cookie.setMaxAge( maxAge );
        cookie.setSecure( true );
        cookie.setHttpOnly( true );
        return cookie;
    }

    public static String generateUUID()
    {
        return UUID.randomUUID().toString();
    }
}
