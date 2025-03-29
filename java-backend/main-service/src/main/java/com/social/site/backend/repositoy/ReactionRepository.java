package com.social.site.backend.repositoy;

import com.social.site.backend.model.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction,String>
{
    @Query("SELECT r FROM Reaction r WHERE r.post.id = :postId AND r.user.id = :userId")
    Reaction findReactionByPostAndUser(String postId, String userId);
}
