package com.social.site.backend.datastore.core;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public class DataManagerImpl<K,V> implements DataManager<K,V>, ICache<K,V>
{
   private final CrudRepository<V,K> repository;

   public DataManagerImpl( CrudRepository<V,K> repository )
   {
       this.repository = repository;
   }

    @Override
    public V save( V value )
    {
        V object = this.repository.save( value );
        return object;
    }

    @Override
    public V get( K key )
    {
        return this.repository.findById( key ).orElse( null );
    }

    @Override
    public void put(K key, V value)
    {

    }

    @Override
    public void refresh(List<K> keys)
    {

    }
}
