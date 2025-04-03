package com.social.site.backend.controller;

import com.social.site.backend.common.annotation.HandleAPIException;
import com.social.site.backend.common.api.HttpStatusCode;
import com.social.site.backend.common.api.Response;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.common.exception.ftp.FileUploadException;
import com.social.site.backend.dto.payload.UpdateProfilePayload;
import com.social.site.backend.dto.payload.UserPayload;
import com.social.site.backend.dto.response.ProfileViewUserDto;
import com.social.site.backend.dto.response.UserDto;
import com.social.site.backend.service.user.IUserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


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
    public ResponseEntity<Response<UserDto>> createUser(@ModelAttribute UserPayload userPayload) throws ValidationException, AuthException, FileUploadException
    {
        UserDto createdUser = userService.save( userPayload );
        return Response.wrap( HttpStatusCode.CREATED, createdUser );
    }

    @GetMapping(path = "/search")
    @HandleAPIException
    public ResponseEntity<Response<List<UserDto>>> search(@RequestParam String keyword)
    {
        List<UserDto> userDtos = userService.search(keyword);
        return Response.wrap(HttpStatusCode.SUCCESS, userDtos);
    }

    @GetMapping(path = "/{id}")
    @HandleAPIException
    public ResponseEntity<Response<ProfileViewUserDto>> viewUser(@PathVariable("id") String userId)
    {
        ProfileViewUserDto userDto = userService.findUserDto(userId);
        return Response.success(userDto);
    }

    @RequestMapping(path = "/{userId}", method = RequestMethod.PATCH)
    @HandleAPIException
    public ResponseEntity<Response<UserDto>> changeProfilePicture(
            HttpServletRequest request,
            @PathVariable String userId,
            @ModelAttribute UpdateProfilePayload payload
    ) throws AuthException, ValidationException, FileUploadException
    {
        UserDto userDto = userService.changePhoto(request, userId, payload.getProfilePic(), payload.getCoverPic());
        return Response.created(userDto);
    }
}
