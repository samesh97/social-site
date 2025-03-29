package com.social.site.backend.controller;

import com.social.site.backend.common.annotation.HandleAPIException;
import com.social.site.backend.common.api.Response;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.dto.payload.FriendPayload;
import com.social.site.backend.dto.payload.FriendRequestActionPayload;
import com.social.site.backend.dto.response.FriendDto;
import com.social.site.backend.service.friend.IFriendService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/friends")
public class FriendController
{
    private final IFriendService friendService;

    public FriendController(IFriendService friendService)
    {
        this.friendService = friendService;
    }

    @GetMapping(path = "/requests")
    @HandleAPIException
    public ResponseEntity<Response<List<FriendDto>>> getFriendRequests(HttpServletRequest request) throws AuthException
    {
        List<FriendDto> friendRequests = friendService.getFriendRequests(request);
        return Response.success(friendRequests);
    }

    @PostMapping
    @HandleAPIException
    public ResponseEntity<Response<String>> makeFriend(HttpServletRequest request, @RequestBody FriendPayload payload) throws ValidationException, AuthException
    {
        FriendDto friendDto = friendService.handleConnection(request, payload);
        return Response.created("Success!");
    }

    @PostMapping(path = "/action")
    @HandleAPIException
    public ResponseEntity<Response<String>> takeAction(HttpServletRequest request, @RequestBody FriendRequestActionPayload payload) throws ValidationException, AuthException
    {
        FriendDto friendDto = friendService.takeAction(request, payload);
        return Response.created("Success!");
    }
}
