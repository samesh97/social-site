package com.social.site.backend.configuration;

import com.social.site.backend.authentication.AuthFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InstanceCreator
{
    @Bean
    public FilterRegistrationBean<AuthFilter> authFilterFilterRegistrationBean()
    {
        FilterRegistrationBean<AuthFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter( new AuthFilter() );
        registrationBean.addUrlPatterns("/*");
        return registrationBean;
    }
}
