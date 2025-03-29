package com.social.site.backend.repositoy;

import com.social.site.backend.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends CrudRepository<User, Integer>
{
    User findByEmail( String email );
    User findById(String id);
    @Query("SELECT u FROM User u WHERE u.firstName LIKE :keyword% OR u.lastName LIKE :keyword%")
    List<User> findByName(String keyword);
}
