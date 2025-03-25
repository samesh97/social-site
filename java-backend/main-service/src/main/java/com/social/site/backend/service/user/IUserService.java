package com.social.site.backend.service.user;

import com.social.site.backend.dto.payload.UserPayload;
import com.social.site.backend.dto.response.UserResponse;
import com.social.site.backend.exception.ValidationException;

public interface IUserService
{
    UserResponse save( UserPayload user ) throws ValidationException;
}
