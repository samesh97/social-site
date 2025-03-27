package com.social.site.backend.common.annotation;

import com.social.site.backend.common.api.HttpStatusCode;
import com.social.site.backend.common.api.Response;
import com.social.site.backend.common.exception.ValidationException;
import com.social.site.backend.common.exception.auth.AuthException;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class APIExceptionHandler
{
    @Around("@annotation(HandleAPIException)")
    public Object handleException(ProceedingJoinPoint proceedingJoinPoint)
    {
        try
        {
            return proceedingJoinPoint.proceed();
        }
        catch (Throwable exception)
        {
            System.out.println(exception);
            if (exception instanceof ValidationException)
            {
                return Response.wrap( HttpStatusCode.BAD_REQUEST, exception.getMessage() );
            }
            if (exception instanceof AuthException)
            {
                return Response.wrap( HttpStatusCode.UNAUTHENTICATED, exception.getMessage() );
            }
            return Response.wrap( HttpStatusCode.SERVER_ERROR, "The server is having issues processing the request." );
        }
    }
}
