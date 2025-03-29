package com.social.site.backend.service.auth;

import com.social.site.backend.dto.payload.LoginPayload;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.dto.response.LoginDto;
import com.social.site.backend.dto.response.TokenRefreshDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface IAuthService
{
    LoginDto login(LoginPayload payload, HttpServletResponse response ) throws ValidationException, AuthException;
    void logout( HttpServletRequest request, HttpServletResponse response ) throws ValidationException, AuthException;
    TokenRefreshDto refresh(HttpServletRequest request, HttpServletResponse response) throws ValidationException, AuthException;
}
