package com.social.site.backend.core.datastore;

import org.springframework.data.repository.CrudRepository;

public interface DataManager<K,V>
{
    V save( V value );
    V get( K key );
}
