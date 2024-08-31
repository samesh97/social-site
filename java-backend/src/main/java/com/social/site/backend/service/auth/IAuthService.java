package com.social.site.backend.service.auth;

import com.social.site.backend.dto.payload.LoginPayload;
import com.social.site.backend.exception.ValidationException;
import com.social.site.backend.exception.auth.AuthException;
import jakarta.servlet.http.HttpServletResponse;

public interface IAuthService
{
    void login( LoginPayload payload, HttpServletResponse response ) throws ValidationException, AuthException;
}
