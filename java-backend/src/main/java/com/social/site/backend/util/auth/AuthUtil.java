package com.social.site.backend.util.auth;

import jakarta.servlet.http.HttpServletResponse;

public interface AuthUtil
{
    String genHash( String plainPassword );
    boolean verifyHash( String plainPassword, String hashedPassword );
    void setHttpCookie(HttpServletResponse response, String name, String value, int maxAge );
    String generateUUID();
}
