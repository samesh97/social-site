package com.social.site.backend.common.api;

import org.springframework.http.ResponseEntity;

public class Response<T>
{
    private int code;
    private T data;
    private String error;

    private Response(int code, T body, String error )
    {
        this.code = code;
        this.data = body;
        this.error = error;
    }

    public static <T> ResponseEntity<Response<T>> success( T data )
    {
        return createResponse( HttpStatusCode.SUCCESS.intValue(), data, null );
    }

    public static <T> ResponseEntity<Response<T>> created( T data )
    {
        return createResponse( HttpStatusCode.CREATED.intValue(), data, null );
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

    public int getCode() {
        return code;
    }

    public T getData() {
        return data;
    }

    public String getError() {
        return error;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public void setData(T data) {
        this.data = data;
    }

    public void setError(String error) {
        this.error = error;
    }
}
