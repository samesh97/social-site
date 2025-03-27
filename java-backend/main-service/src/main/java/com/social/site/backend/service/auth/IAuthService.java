package com.social.site.backend.service.auth;

import com.social.site.backend.dto.payload.LoginPayload;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.dto.response.LoginResponse;
import com.social.site.backend.dto.response.TokenRefreshResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface IAuthService
{
    LoginResponse login(LoginPayload payload, HttpServletResponse response ) throws ValidationException, AuthException;
    void logout( HttpServletRequest request, HttpServletResponse response ) throws ValidationException, AuthException;
    TokenRefreshResponse refresh(HttpServletRequest request,HttpServletResponse response) throws ValidationException, AuthException;
}
