package com.social.site.backend.repositoy;

import com.social.site.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String>
{
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId")
    List<Comment> getPostComments(String postId);
}
