package com.social.site.backend.service.user;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.common.exception.ftp.FileUploadException;
import com.social.site.backend.common.ftp.FileUploader;
import com.social.site.backend.dto.payload.UserPayload;
import com.social.site.backend.dto.response.FriendDto;
import com.social.site.backend.dto.response.ProfileViewUserDto;
import com.social.site.backend.dto.response.UserDto;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.enums.TokenType;
import com.social.site.backend.mapper.FriendMapper;
import com.social.site.backend.mapper.UserMapper;
import com.social.site.backend.model.Friend;
import com.social.site.backend.model.User;
import com.social.site.backend.repositoy.UserRepository;
import com.social.site.backend.util.CommonUtil;
import com.social.site.backend.util.auth.AuthUtil;
import com.social.site.backend.common.validator.Validator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Stream;

import static com.social.site.backend.common.Constants.ACCESS_TOKEN_COOKIE_NAME;
import static com.social.site.backend.common.Constants.JWT_TOKEN_PAYLOAD_USER_ID;
import static com.social.site.backend.common.Constants.REFRESH_TOKEN_COOKIE_NAME;

@Service
public class UserService implements IUserService
{
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthUtil authUtil;
    private final FileUploader fileUploader;
    private final FriendMapper friendMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper, AuthUtil authUtil, FileUploader fileUploader, FriendMapper friendMapper)
    {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.authUtil = authUtil;
        this.fileUploader = fileUploader;
        this.friendMapper = friendMapper;
    }

    @Override
    public UserDto save(UserPayload userPayload ) throws ValidationException, AuthException, FileUploadException
    {
        Validator.validate( userPayload );
        User existingUser = userRepository.findByEmail( userPayload.getEmail() );
        if ( !CommonUtil.isNull( existingUser ) )
        {
            throw new ValidationException("Email is already taken.");
        }
        userPayload.setPassword( authUtil.genHash( userPayload.getPassword() ) );

        User user = userMapper.mapToUser( userPayload );

        if(!CommonUtil.isNull(userPayload.getProfilePic()))
        {
            String profileUrl = this.fileUploader.uploadFile(userPayload.getProfilePic(),null);
            user.setProfileUrl(profileUrl);
        }

        return userMapper.mapUserResponse( userRepository.save( user ) );
    }

    @Override
    public User findUser(String id)
    {
        return userRepository.findById(id);
    }

    @Override
    public User getUserFromToken(HttpServletRequest request, TokenType tokenType) throws AuthException
    {
        String token = authUtil.getCookie( request,
                tokenType == TokenType.ACCESS_TOKEN ? ACCESS_TOKEN_COOKIE_NAME : REFRESH_TOKEN_COOKIE_NAME );

        if(CommonUtil.isNull(token))
        {
            throw new AuthException("Token not found.");
        }

        DecodedJWT decodedJWT = authUtil.verifyToken(token, tokenType);
        if(CommonUtil.isNull(decodedJWT))
        {
            throw new AuthException("Invalid token.");
        }

        String userId = decodedJWT.getClaim(JWT_TOKEN_PAYLOAD_USER_ID).asString();
        User user = findUser(userId);
        if(CommonUtil.isNull(user))
        {
            throw new AuthException("User associated with the token is not found!");
        }
        return user;
    }

    @Override
    public List<UserDto> search(String keyword)
    {
        return userMapper.mapUserDto(userRepository.findByName(keyword));
    }

    @Override
    public ProfileViewUserDto findUserDto(String id)
    {
        User user = findUser(id);
        ProfileViewUserDto profileViewUserDto = userMapper.mapProfileViewUserDto(user);

        List<Friend> receivedRequests = user.getReceivedFriendRequests();
        List<Friend> sentRequests = user.getSentFriendRequests();

        List<Friend> allAcceptedFriendRequests = Stream.concat(receivedRequests.stream(), sentRequests.stream())
                .filter(Friend::isAccepted)
                .toList();

        List<FriendDto> allAcceptedFriendRequestsDto = friendMapper.convert(allAcceptedFriendRequests);
        profileViewUserDto.setFriends(allAcceptedFriendRequestsDto);
        return profileViewUserDto;
    }

    @Override
    public UserDto changePhoto(HttpServletRequest request, String userId, MultipartFile profilePic, MultipartFile coverPic) throws AuthException, ValidationException, FileUploadException
    {
        if(CommonUtil.isNull(profilePic) == CommonUtil.isNull(coverPic))
        {
            throw new ValidationException("You cannot change/not change profile picture and cover photo at once.");
        }

        if(CommonUtil.isNullOrEmpty(userId))
        {
            throw new ValidationException("UserId is null or empty");
        }

        User user = getUserFromToken(request, TokenType.ACCESS_TOKEN);
        if(CommonUtil.isNull(user))
        {
            throw new AuthException("No user found in the session.");
        }

        User changingUser = findUser(userId);
        if(CommonUtil.isNull(changingUser))
        {
            throw new ValidationException("No user found with the given id.");
        }

        if(!user.getId().equals(changingUser.getId()))
        {
            throw new ValidationException("The session user and the user associated with the change is not the same!");
        }

        if(!CommonUtil.isNull(profilePic))
        {
            String downloadUrl = fileUploader.uploadFile(profilePic,null);
            user.setProfileUrl(downloadUrl);
        }
        else
        {
            String downloadUrl = fileUploader.uploadFile(coverPic,null);
            user.setCoverUrl(downloadUrl);
        }
        return userMapper.mapUserResponse(userRepository.save(user));
    }
}
