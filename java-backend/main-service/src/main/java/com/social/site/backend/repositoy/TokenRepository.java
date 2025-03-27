package com.social.site.backend.repositoy;

import com.social.site.backend.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<Token,String>
{
    Token findByToken(String token);
}
