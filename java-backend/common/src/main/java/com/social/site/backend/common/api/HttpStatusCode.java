package com.social.site.backend.common.api;

public enum HttpStatusCode
{
    SUCCESS( 200 ),
    CREATED( 201 ),
    BAD_REQUEST( 400 ),
    UNAUTHENTICATED( 401 ),
    UNAUTHORIZED( 403 ),
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
