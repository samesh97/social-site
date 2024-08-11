package com.social.site.backend.enums;

public enum HttpStatusCode
{
    SUCCESS( 200 ),
    CREATED( 201 ),
    BAD_REQUEST( 400 ),
    NOT_FOUND( 404 ),
    SERVER_ERROR( 500 );

    private final int status;

    HttpStatusCode( int status )
    {
        this.status = status;
    }
    public int intValue()
    {
        return status;
    }
}
