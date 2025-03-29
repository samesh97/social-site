package com.social.site.backend.repositoy;

import com.social.site.backend.model.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction,String>
{
}
