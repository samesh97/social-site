package com.social.site.backend.service.interfaces;

import com.social.site.backend.dto.Response;
import com.social.site.backend.dto.UserDto;
import com.social.site.backend.payload.LoginPayload;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface IAuthService
{
    ResponseEntity<Response<UserDto>> login(LoginPayload payload, HttpServletResponse response);
}
