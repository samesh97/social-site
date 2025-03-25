package com.social.site.backend.service.user;

import com.social.site.backend.common.exception.auth.AuthException;
import com.social.site.backend.dto.payload.UserPayload;
import com.social.site.backend.dto.response.UserResponse;
import com.social.site.backend.common.exception.ValidationException;

public interface IUserService
{
    UserResponse save( UserPayload user ) throws ValidationException, AuthException;
}
