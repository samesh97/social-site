package com.social.site.backend.controller;

import com.social.site.backend.dto.Response;
import com.social.site.backend.dto.UserDto;
import com.social.site.backend.enums.HttpStatusCode;
import com.social.site.backend.exception.ValidationException;
import com.social.site.backend.mapper.UserMapper;
import com.social.site.backend.model.User;
import com.social.site.backend.service.interfaces.IUserService;
import com.social.site.backend.validator.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.social.site.backend.util.AuthUtil.hashPassword;

@RestController
@RequestMapping( path = "/users" )
public class UserController
{
    @Autowired
    private IUserService userService;

    @Autowired
    private UserMapper userMapper;

    @PostMapping
    public ResponseEntity<Response<User>> createUser( @RequestBody User user )
    {
        try
        {
            Validator.validate( user );
            user.setPassword( hashPassword( user.getPassword() ) );
            User createdUser = userService.save( user );
            return Response.wrap( HttpStatusCode.CREATED, createdUser, "User created." );
        }
        catch ( ValidationException e )
        {
            return Response.wrap( HttpStatusCode.NOT_FOUND, e.getMessage() );
        }
        catch ( Exception e )
        {
            return Response.wrap( HttpStatusCode.SERVER_ERROR, e.getMessage() );
        }
    }

    @GetMapping
    public ResponseEntity<Response<List<UserDto>>> getAll()
    {
        try
        {
            List<User> users = userService.getAll();
            return Response.wrap( HttpStatusCode.SUCCESS, userMapper.map( users ) );
        }
        catch ( Exception e )
        {
            return Response.wrap( HttpStatusCode.NOT_FOUND, "No users found." );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<UserDto>> findUser(@PathVariable int id )
    {
        try
        {
            User user = userService.findUser( id );
            return Response.wrap(HttpStatusCode.SUCCESS, userMapper.map( user ) );
        }
        catch ( Exception e )
        {
            return Response.wrap( HttpStatusCode.NOT_FOUND,"No user found"  );
        }
    }
}
