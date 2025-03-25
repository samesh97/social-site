package com.social.site.backend.util;

import java.util.Arrays;

public class CommonUtil
{
    public static <T> boolean isNull( T object )
    {
        return object == null;
    }
    public static boolean isNullOrEmpty( String ...object )
    {
        if( object == null )
        {
            return true;
        }
        if( object.length == 0 )
        {
            return true;
        }
        return Arrays.stream( object )
                     .anyMatch( str -> str == null || str.trim().isEmpty() );
    }
}
