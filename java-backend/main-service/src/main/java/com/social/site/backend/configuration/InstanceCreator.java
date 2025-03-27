package com.social.site.backend.configuration;

import com.auth0.jwt.algorithms.Algorithm;
import com.social.site.backend.common.Constants;
import com.social.site.backend.filters.AuthFilter;
import com.social.site.backend.util.auth.AuthUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InstanceCreator
{
    @Bean
    public FilterRegistrationBean<AuthFilter> authFilterFilterRegistrationBean(AuthUtil authUtil)
    {
        FilterRegistrationBean<AuthFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter( new AuthFilter(authUtil) );
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }
    @Bean
    @Qualifier(value = Constants.JWT_ACCESS_TOKEN_ALGORITHM)
    public Algorithm jwtAccessTokenSignAlgorithm()
    {
        //TODO: replace the secret to an environment variable
        return Algorithm.HMAC256("12345");
    }
    @Bean
    @Qualifier(value = Constants.JWT_REFRESH_TOKEN_ALGORITHM)
    public Algorithm jwtRefreshTokenSignAlgorithm()
    {
        //TODO: replace the secret to an environment variable
        return Algorithm.HMAC256("123456789");
    }
}
