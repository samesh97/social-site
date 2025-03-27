package com.social.site.backend.filters;


import com.social.site.backend.common.Constants;
import com.social.site.backend.enums.TokenType;
import com.social.site.backend.util.auth.AuthUtil;
import jakarta.servlet.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Arrays;

public class AuthFilter implements Filter
{
    private final AuthUtil authUtil;

    public AuthFilter(AuthUtil authUtil)
    {
        this.authUtil = authUtil;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException
    {
        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException
    {
        HttpServletRequest request = ( HttpServletRequest ) servletRequest;
        HttpServletResponse response = ( HttpServletResponse ) servletResponse;

        boolean isValid = false;

        if(isBypassAuth(request))
        {
            isValid = true;
        }
        else
        {
            String accessToken = authUtil.getCookie(request, Constants.ACCESS_TOKEN_COOKIE_NAME);
            isValid = authUtil.verifyToken(accessToken, TokenType.ACCESS_TOKEN) != null;
        }

        if(!isValid)
        {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized.");
            return;
        }
        filterChain.doFilter( servletRequest, servletResponse );
    }

    private boolean isBypassAuth(HttpServletRequest request)
    {
        String method = request.getMethod();

        //bypassing pre-flight requests
        if("OPTIONS".equals(method))
        {
            return true;
        }

        String url = request.getRequestURL().toString();
        if(!url.endsWith("/"))
        {
            url += "/";
        }
        String finalUrl = url;
        return Arrays.stream(AuthUtil.bypassAuthUrls)
                     .map(bypassUrl ->
                     {
                         if (!bypassUrl.endsWith("/"))
                         {
                             return bypassUrl + "/";
                         }
                         return bypassUrl;

                     })
                     .anyMatch(finalUrl::endsWith);
    }

    @Override
    public void destroy()
    {
        Filter.super.destroy();
    }
}
