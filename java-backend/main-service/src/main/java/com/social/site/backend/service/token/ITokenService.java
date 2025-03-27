package com.social.site.backend.service.token;

import com.social.site.backend.model.Token;
import com.social.site.backend.model.User;

public interface ITokenService
{
    Token createAccessToken(User user, String token, String sessionId);
    Token createRefreshToken(User user, String token);
    Token findToken(String token);
    void deleteToken(String token);
}
