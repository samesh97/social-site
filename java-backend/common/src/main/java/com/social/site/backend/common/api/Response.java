package com.social.site.backend.common.api;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;

import java.io.Serializable;

@Getter
@Setter
public class Response<T> implements Serializable
{
    private final int code;
    private final T data;
    private final String error;

    private Response(int code, T body, String error )
    {
        this.code = code;
        this.data = body;
        this.error = error;
    }

    public static <T> ResponseEntity<Response<T>> wrap( HttpStatusCode status, String error )
    {
        return createResponse( status.intValue(), null, error );
    }

    public static <T> ResponseEntity<Response<T>> wrap( HttpStatusCode status, T data )
    {
       return createResponse( status.intValue(), data, null );
    }

    public static <T> ResponseEntity<Response<T>> wrap( HttpStatusCode status, T data, String error )
    {
        return createResponse( status.intValue(), data, error );
    }

    private static <T> ResponseEntity<Response<T>> createResponse( int status, T data, String error )
    {
        Response<T> response = new Response<>( status, data, error );
        return ResponseEntity.status( status ).body( response );
    }
}
