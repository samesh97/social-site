package com.social.site.backend.controller;

import com.social.site.backend.dto.Response;
import com.social.site.backend.dto.UserDto;
import com.social.site.backend.payload.LoginPayload;
import com.social.site.backend.service.interfaces.IAuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping( path = "/auth" )
public class AuthController
{
    private final IAuthService authService;

    public AuthController( IAuthService authService )
    {
        this.authService = authService;
    }

    @PostMapping( path = "/login" )
    public ResponseEntity<Response<UserDto>> login( @RequestBody LoginPayload payload, HttpServletResponse response )
    {
        return authService.login( payload, response );
    }
}
