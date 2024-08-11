package com.social.site.backend.filters;


import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class AuthFilter implements Filter {


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

        //TODO: Auth logic implementation
//        if( request.getHeader("Authorization") == null )
//        {
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized.");
//        }
        filterChain.doFilter( servletRequest, servletResponse );
    }

    @Override
    public void destroy()
    {
        Filter.super.destroy();
    }
}
