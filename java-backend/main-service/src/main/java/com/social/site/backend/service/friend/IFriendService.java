package com.social.site.backend.service.friend;

import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.dto.payload.FriendPayload;
import com.social.site.backend.dto.payload.FriendRequestActionPayload;
import com.social.site.backend.dto.response.FriendDto;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface IFriendService
{
    List<FriendDto> getFriendRequests(HttpServletRequest request) throws AuthException;
    FriendDto handleConnection(HttpServletRequest request, FriendPayload payload) throws AuthException, ValidationException;
    FriendDto takeAction(HttpServletRequest request, FriendRequestActionPayload payload) throws ValidationException, AuthException;
    List<FriendDto> getAllFriends(String userId);
}
