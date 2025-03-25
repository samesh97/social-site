package com.social.site.backend.datastore.core;

import org.springframework.data.repository.CrudRepository;

public interface DataManager<K,V>
{
    V save( V value );
    V get( K key );
}
