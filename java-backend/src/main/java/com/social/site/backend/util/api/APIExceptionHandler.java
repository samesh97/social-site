package com.social.site.backend.util.api;

import com.social.site.backend.dto.Response;
import com.social.site.backend.enums.HttpStatusCode;
import com.social.site.backend.exception.ValidationException;
import com.social.site.backend.exception.auth.AuthException;
import org.springframework.http.ResponseEntity;

public class APIExceptionHandler
{
    private APIExceptionHandler()
    {

    }

    public static <T> ResponseEntity<Response<T>> handle(Exception exception)
    {
        if (exception instanceof ValidationException)
        {
            return Response.wrap( HttpStatusCode.BAD_REQUEST, exception.getMessage() );
        }
        if (exception instanceof AuthException)
        {
            return Response.wrap( HttpStatusCode.UNAUTHENTICATED, exception.getMessage() );
        }
        return Response.wrap( HttpStatusCode.SERVER_ERROR, exception.getMessage() );
    }
}
