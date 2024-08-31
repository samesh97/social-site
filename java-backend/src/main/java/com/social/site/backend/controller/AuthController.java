package com.social.site.backend.controller;

import com.social.site.backend.dto.Response;
import com.social.site.backend.dto.payload.LoginPayload;
import com.social.site.backend.enums.HttpStatusCode;
import com.social.site.backend.exception.ValidationException;
import com.social.site.backend.exception.auth.AuthException;
import com.social.site.backend.service.auth.IAuthService;
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
            return Response.wrap( HttpStatusCode.SUCCESS, "Login success!", null );
        }
        catch ( ValidationException e )
        {
            return Response.wrap( HttpStatusCode.BAD_REQUEST, e.getMessage() );
        }
        catch ( AuthException e )
        {
            return Response.wrap( HttpStatusCode.UNAUTHENTICATED, e.getMessage() );
        }
        catch ( Exception e )
        {
            return Response.wrap( HttpStatusCode.SERVER_ERROR, e.getMessage() );
        }
    }
}
