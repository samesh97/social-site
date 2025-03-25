package com.social.site.backend.service.auth;

import com.social.site.backend.dto.payload.LoginPayload;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.exception.auth.AuthException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface IAuthService
{
    void login( LoginPayload payload, HttpServletResponse response ) throws ValidationException, AuthException;
    void logout( HttpServletRequest request ) throws ValidationException, AuthException;
}
