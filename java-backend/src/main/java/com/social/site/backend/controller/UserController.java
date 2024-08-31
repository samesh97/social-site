package com.social.site.backend.controller;

import com.social.site.backend.dto.Response;
import com.social.site.backend.dto.response.UserResponse;
import com.social.site.backend.enums.HttpStatusCode;
import com.social.site.backend.exception.ValidationException;
import com.social.site.backend.mapper.UserMapper;
import com.social.site.backend.model.User;
import com.social.site.backend.service.user.IUserService;
import com.social.site.backend.util.auth.AuthUtil;
import com.social.site.backend.validator.Validator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping( path = "/users" )
public class UserController
{
    private final IUserService userService;
    private final UserMapper userMapper;
    private final AuthUtil authUtil;

    public UserController(IUserService userService, UserMapper userMapper, AuthUtil authUtil )
    {
        this.userService = userService;
        this.userMapper = userMapper;
        this.authUtil = authUtil;
    }

    @PostMapping
    public ResponseEntity<Response<UserResponse>> createUser( @RequestBody User user )
    {
        try
        {
            Validator.validate( user );
            user.setPassword( authUtil.genHash( user.getPassword() ) );
            UserResponse createdUser = userService.save( user );
            return Response.wrap( HttpStatusCode.CREATED, createdUser );
        }
        catch ( ValidationException e )
        {
            return Response.wrap( HttpStatusCode.BAD_REQUEST, e.getMessage() );
        }
        catch ( Exception e )
        {
            return Response.wrap( HttpStatusCode.SERVER_ERROR, e.getMessage() );
        }
    }

    @GetMapping
    public ResponseEntity<Response<List<UserResponse>>> getAll()
    {
        try
        {
            List<UserResponse> users = userService.getAll();
            return Response.wrap( HttpStatusCode.SUCCESS, users );
        }
        catch ( Exception e )
        {
            return Response.wrap( HttpStatusCode.NOT_FOUND, "No users found." );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<UserResponse>> findUser( @PathVariable int id )
    {
        try
        {
            UserResponse user = userService.findUser(id);
            return Response.wrap( HttpStatusCode.SUCCESS, user );
        }
        catch (ValidationException e)
        {
            return Response.wrap( HttpStatusCode.BAD_REQUEST, e.getMessage() );
        }
        catch ( Exception e )
        {
            return Response.wrap( HttpStatusCode.SERVER_ERROR, e.getMessage() );
        }
    }
}
