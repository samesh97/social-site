package com.social.site.backend.core.datastore;

import java.util.List;

public interface ICache<K,V>
{
    V get( K key );
    void put( K key, V value );
    void refresh( List<K> keys );
}