package com.social.site.backend.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.mindrot.jbcrypt.BCrypt;

import java.util.UUID;

public class AuthUtil
{
    private static final String HASH_PW_SEPARATOR = ":::";

    public static String hashPassword( String plainPassword )
    {
        String salt = BCrypt.gensalt( 10 );
        String hashedPassword = BCrypt.hashpw( plainPassword, salt );
        return hashedPassword + HASH_PW_SEPARATOR + salt;
    }

    public static boolean isHashMatching( String hashedPasswordToCheck, String plainPassword )
    {
        String[] parts = hashedPasswordToCheck.split( HASH_PW_SEPARATOR );
        String salt = parts[1];
        return BCrypt.checkpw( plainPassword, salt );
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
