package com.social.site.backend.service.friend;

import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.dto.payload.FriendPayload;
import com.social.site.backend.dto.payload.FriendRequestActionPayload;
import com.social.site.backend.dto.response.FriendDto;
import com.social.site.backend.enums.TokenType;
import com.social.site.backend.mapper.FriendMapper;
import com.social.site.backend.model.Friend;
import com.social.site.backend.model.User;
import com.social.site.backend.repositoy.FriendRepository;
import com.social.site.backend.service.user.IUserService;
import com.social.site.backend.util.CommonUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendService implements IFriendService
{

    private final IUserService userService;
    private final FriendRepository repository;
    private final FriendMapper friendMapper;

    public FriendService(IUserService userService, FriendRepository repository, FriendMapper friendMapper)
    {
        this.userService = userService;
        this.repository = repository;
        this.friendMapper = friendMapper;
    }

    @Override
    public List<FriendDto> getFriendRequests(HttpServletRequest request) throws AuthException
    {
        User user = userService.getUserFromToken(request, TokenType.ACCESS_TOKEN);
        return friendMapper.convert(this.repository.findFriendRequests(user.getId()));
    }

    @Override
    public FriendDto handleConnection(HttpServletRequest request, FriendPayload payload) throws AuthException, ValidationException
    {
        User requestedUser = userService.getUserFromToken(request, TokenType.ACCESS_TOKEN);
        User acceptedUser = userService.findUser(payload.getUserId());

        if(CommonUtil.isNull(requestedUser))
        {
            throw new ValidationException("Request initiated user not found!");
        }

        if(CommonUtil.isNull(acceptedUser))
        {
            throw new ValidationException("Request targeted user not found!");
        }

        Friend currentConnection = repository.findFriend(requestedUser.getId(), acceptedUser.getId());
        if(CommonUtil.isNull(currentConnection))
        {
            //new request
            Friend friend = new Friend(requestedUser, acceptedUser);
            friend.setAccepted(false);

            return friendMapper.convert(repository.save(friend));
        }

        if(currentConnection.isAccepted())
        {
            //unfriend
            repository.delete(currentConnection);
            return null;
        }

        if(currentConnection.getRequestedUser().getId().equals(requestedUser.getId()))
        {
            //undo friend request
            repository.delete(currentConnection);
            return null;
        }

        //connection accepted
        currentConnection.setAccepted(true);
        return friendMapper.convert(currentConnection);
    }

    @Override
    public FriendDto takeAction(HttpServletRequest request, FriendRequestActionPayload payload) throws ValidationException, AuthException
    {
        User requestedUser = userService.getUserFromToken(request, TokenType.ACCESS_TOKEN);
        User acceptedUser = userService.findUser(payload.getUserId());

        if(CommonUtil.isNull(requestedUser))
        {
            throw new ValidationException("Request initiated user not found!");
        }

        if(CommonUtil.isNull(acceptedUser))
        {
            throw new ValidationException("Request targeted user not found!");
        }

        Friend currentConnection = repository.findFriend(requestedUser.getId(), acceptedUser.getId());
        if(CommonUtil.isNull(currentConnection))
        {
            throw new ValidationException("Friend request is longer valid.");
        }

        if(currentConnection.isAccepted())
        {
            throw new ValidationException("Friend request is already accepted.");
        }

        if(payload.isAccepted())
        {
            //accept friend request
            currentConnection.setAccepted(true);
            return friendMapper.convert(repository.save(currentConnection));

        }
        //delete request
        repository.delete(currentConnection);
        return null;
    }

    @Override
    public List<FriendDto> getAllFriends(String userId)
    {
        return null;
    }
}
