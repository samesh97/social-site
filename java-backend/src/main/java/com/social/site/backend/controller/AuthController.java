package com.social.site.backend.controller;

import com.social.site.backend.dto.Response;
import com.social.site.backend.dto.payload.LoginPayload;
import com.social.site.backend.enums.HttpStatusCode;
import com.social.site.backend.service.auth.IAuthService;
import com.social.site.backend.util.api.APIExceptionHandler;
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
    public ResponseEntity<Response<String>> login(@RequestBody LoginPayload payload, HttpServletResponse response )
    {
        try
        {
            authService.login( payload, response );
            return Response.wrap( HttpStatusCode.SUCCESS, "Login success!" );
        }
        catch ( Exception e )
        {
            return APIExceptionHandler.handle(e);
        }
    }

    @PostMapping( path = "/logout" )
    public ResponseEntity<Response<String>> logout( HttpServletRequest request )
    {
        try
        {
            authService.logout( request );
            return Response.wrap( HttpStatusCode.SUCCESS, "Logout success!" );
        }
        catch ( Exception e )
        {
            return APIExceptionHandler.handle(e);
        }
    }
}
