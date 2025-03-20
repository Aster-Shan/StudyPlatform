package com.studyplatform.studyplatform.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class ChatRoomDTO {
    private Long id;
    private String name;
    private String description;
    private boolean isGroupChat;
    private Long createdBy;
    private Set<Long> participants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long unreadCount;
    private ChatMessageDTO latestMessage;
    
    // Getters and Setters
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public boolean isGroupChat() {
        return isGroupChat;
    }
    
    public void setGroupChat(boolean isGroupChat) {
        this.isGroupChat = isGroupChat;
    }
    
    public Long getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }
    
    public Set<Long> getParticipants() {
        return participants;
    }
    
    public void setParticipants(Set<Long> participants) {
        this.participants = participants;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public long getUnreadCount() {
        return unreadCount;
    }
    
    public void setUnreadCount(long unreadCount) {
        this.unreadCount = unreadCount;
    }
    
    public ChatMessageDTO getLatestMessage() {
        return latestMessage;
    }
    
    public void setLatestMessage(ChatMessageDTO latestMessage) {
        this.latestMessage = latestMessage;
    }
}

