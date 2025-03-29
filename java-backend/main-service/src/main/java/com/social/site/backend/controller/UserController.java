package com.social.site.backend.controller;

import com.social.site.backend.common.annotation.HandleAPIException;
import com.social.site.backend.common.api.HttpStatusCode;
import com.social.site.backend.common.api.Response;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.dto.payload.UserPayload;
import com.social.site.backend.dto.response.UserDto;
import com.social.site.backend.service.user.IUserService;
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
    @HandleAPIException
    public ResponseEntity<Response<UserDto>> createUser(@ModelAttribute UserPayload userPayload) throws ValidationException, AuthException
    {
        UserDto createdUser = userService.save( userPayload );
        return Response.wrap( HttpStatusCode.CREATED, createdUser );
    }
}
