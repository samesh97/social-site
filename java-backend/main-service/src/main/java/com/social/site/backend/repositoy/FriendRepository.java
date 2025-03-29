package com.social.site.backend.repositoy;

import com.social.site.backend.model.Friend;
import com.social.site.backend.model.key.FriendKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRepository extends JpaRepository<Friend, FriendKey>
{
    @Query("SELECT f FROM Friend f WHERE f.isAccepted=false AND f.acceptedUser.id=:id")
    List<Friend> findFriendRequests(String id);

    @Query("SELECT f " +
            "FROM Friend f " +
            "WHERE f.requestedUser.id IN (:initiatedUserId, :targetedUserId) " +
            "AND f.acceptedUser.id IN (:initiatedUserId, :targetedUserId) "
    )
    Friend findFriend(String initiatedUserId, String targetedUserId);
}
