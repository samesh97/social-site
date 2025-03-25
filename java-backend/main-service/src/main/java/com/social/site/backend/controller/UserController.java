package com.social.site.backend.controller;

import com.social.site.backend.dto.Response;
import com.social.site.backend.dto.payload.UserPayload;
import com.social.site.backend.dto.response.UserResponse;
import com.social.site.backend.enums.HttpStatusCode;
import com.social.site.backend.service.user.IUserService;
import com.social.site.backend.util.api.APIExceptionHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ModelAttribute;


@RestController
@RequestMapping( path = "/users" )
public class UserController
{
    private final IUserService userService;

    public UserController(IUserService userService )
    {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Response<UserResponse>> createUser(@ModelAttribute UserPayload userPayload)
    {
        try
        {
            UserResponse createdUser = userService.save( userPayload );
            return Response.wrap( HttpStatusCode.CREATED, createdUser );
        }
        catch ( Exception e )
        {
            return APIExceptionHandler.handle(e);
        }
    }
}
