package com.social.site.backend.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;

@Getter
@Setter
public class Response<T>
{
    private final int code;
    private final T data;
    private final String error;

    private Response( int code, T body, String error )
    {
        this.code = code;
        this.data = body;
        this.error = error;
    }
    public static <T> ResponseEntity<Response<T>> wrap( int status, T data )
    {
       return createResponse( status, data, null );
    }
    public static <T> ResponseEntity<Response<T>> wrap( int status, T data, String error )
    {
        return createResponse( status, data, error );
    }
    private static <T> ResponseEntity<Response<T>> createResponse( int status, T data, String error )
    {
        Response<T> response = new Response<>( status, data, error );
        return ResponseEntity.status( status ).body( response );
    }
}
