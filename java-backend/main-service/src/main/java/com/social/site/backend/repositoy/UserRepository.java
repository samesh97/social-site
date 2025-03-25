package com.social.site.backend.repositoy;

import com.social.site.backend.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Integer>
{
    User findByEmail( String email );
}
