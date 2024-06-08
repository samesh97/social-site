package com.social.site.backend.controller;

import com.social.site.backend.dto.Response;
import com.social.site.backend.dto.UserDto;
import com.social.site.backend.mapper.UserMapper;
import com.social.site.backend.model.User;
import com.social.site.backend.service.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController
{
    @Autowired
    private IUserService userService;

    @Autowired
    private UserMapper userMapper;

    @PostMapping
    public ResponseEntity<Response<String>> createUser(@RequestBody User user )
    {
        try
        {
            userService.save( user );
            return Response.wrap( 201, "User created." );
        }
        catch ( Exception e )
        {
            return Response.wrap( 500, e.getMessage() );
        }
    }
    @GetMapping("/")
    public ResponseEntity<Response<List<UserDto>>> getAll()
    {
        try
        {
            List<User> users = userService.getAll();
            return Response.wrap( 200, userMapper.map( users ) );
        }
        catch ( Exception e )
        {
            return Response.wrap( 404, null );
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Response<UserDto>> findUser(@PathVariable int id )
    {
        try
        {
            User user = userService.findUser( id );
            return Response.wrap(200, userMapper.map( user ) );
        }
        catch ( Exception e )
        {
            return Response.wrap( 404, null, "No user found"  );
        }
    }
}
