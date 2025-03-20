package com.studyplatform.studyplatform.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.studyplatform.studyplatform.Model.ChatRoom;
import com.studyplatform.studyplatform.Model.User;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    // Find chat rooms where a user is a participant
    List<ChatRoom> findByParticipantsContaining(User user);
    
    // Find private chat between two users
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.isGroupChat = false " +
           "AND :user1 MEMBER OF cr.participants " +
           "AND :user2 MEMBER OF cr.participants " +
           "AND SIZE(cr.participants) = 2")
    Optional<ChatRoom> findPrivateChatBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);
}