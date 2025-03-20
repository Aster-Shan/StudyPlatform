package com.studyplatform.studyplatform.dto;

import java.time.LocalDateTime;

import com.studyplatform.studyplatform.Model.User;

public class ForumReplyDTO {
    private Long id;
    private String content;
    private Long topicId;
    private User user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int upvotes;
    private int downvotes;
    private boolean isAcceptedAnswer;
    
    // Getters and Setters
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Long getTopicId() {
        return topicId;
    }
    
    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
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
    
    public int getUpvotes() {
        return upvotes;
    }
    
    public void setUpvotes(int upvotes) {
        this.upvotes = upvotes;
    }
    
    public int getDownvotes() {
        return downvotes;
    }
    
    public void setDownvotes(int downvotes) {
        this.downvotes = downvotes;
    }
    
    public boolean isAcceptedAnswer() {
        return isAcceptedAnswer;
    }
    
    public void setAcceptedAnswer(boolean isAcceptedAnswer) {
        this.isAcceptedAnswer = isAcceptedAnswer;
    }
}

