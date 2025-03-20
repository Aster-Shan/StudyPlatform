package com.studyplatform.studyplatform.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.studyplatform.studyplatform.Model.ChatMessage;
import com.studyplatform.studyplatform.Model.ChatRoom;
import com.studyplatform.studyplatform.Model.User;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    // Find messages by chat room ordered by sent time
    List<ChatMessage> findByChatRoomOrderBySentAtAsc(ChatRoom chatRoom);
    
    // Count unread messages for a user in a chat room - renamed to match your service
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.chatRoom = :chatRoom AND m.sender != :user AND m.isRead = false")
    long countUnreadMessagesInRoom(@Param("chatRoom") ChatRoom chatRoom, @Param("user") User user);
    
    // Find latest messages in room with pagination (replace the LIMIT query)
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatRoom = :chatRoom ORDER BY cm.sentAt DESC")
    Page<ChatMessage> findLatestMessagesInRoom(@Param("chatRoom") ChatRoom chatRoom, Pageable pageable);
    
    // Convenience method to get the single latest message
    default ChatMessage findLatestMessageInRoom(ChatRoom chatRoom) {
        PageRequest pageRequest = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "sentAt"));
        Page<ChatMessage> messagePage = findLatestMessagesInRoom(chatRoom, pageRequest);
        return messagePage.hasContent() ? messagePage.getContent().get(0) : null;
    }
}