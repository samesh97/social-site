package com.social.site.backend.service.token;

import com.social.site.backend.enums.TokenType;
import com.social.site.backend.model.Token;
import com.social.site.backend.model.User;
import com.social.site.backend.repositoy.TokenRepository;
import org.springframework.stereotype.Service;

@Service
public class TokenService implements ITokenService
{
    private final TokenRepository tokenRepository;

    private TokenService(TokenRepository tokenRepository)
    {
        this.tokenRepository = tokenRepository;
    }

    @Override
    public Token createAccessToken(User user, String tokenString, String sessionIdString)
    {
        Token token = new Token();
        token.setToken(tokenString);
        token.setSessionId(sessionIdString);
        token.setTokenType(TokenType.ACCESS_TOKEN);
        return tokenRepository.save(token);
    }

    @Override
    public Token createRefreshToken(User user, String tokenString)
    {
        Token token = new Token();
        token.setToken(tokenString);
        token.setTokenType(TokenType.REFRESH_TOKEN);
        return tokenRepository.save(token);
    }

    @Override
    public Token findToken(String token)
    {
        return null;
    }

    @Override
    public void deleteToken(String tokenString)
    {
        Token token = tokenRepository.findByToken(tokenString);
        tokenRepository.delete(token);
    }
}
