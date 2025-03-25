package com.social.site.backend.controller;

import com.social.site.backend.common.annotation.HandleAPIException;
import com.social.site.backend.common.api.HttpStatusCode;
import com.social.site.backend.common.api.Response;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.dto.payload.LoginPayload;
import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.service.auth.IAuthService;
import jakarta.servlet.http.HttpServletRequest;
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
    @HandleAPIException
    public ResponseEntity<Response<String>> login(@RequestBody LoginPayload payload, HttpServletResponse response ) throws AuthException, ValidationException
    {
        authService.login( payload, response );
        return Response.wrap( HttpStatusCode.SUCCESS, "Login success!", null);
    }

    @PostMapping( path = "/logout" )
    @HandleAPIException
    public ResponseEntity<Response<String>> logout( HttpServletRequest request ) throws AuthException, ValidationException
    {
        authService.logout( request );
        return Response.wrap( HttpStatusCode.SUCCESS, "Logout success!", null );
    }
}
