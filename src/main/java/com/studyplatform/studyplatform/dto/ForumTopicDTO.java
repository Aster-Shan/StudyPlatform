package com.studyplatform.studyplatform.dto;

import java.time.LocalDateTime;
import java.util.Set;

import com.studyplatform.studyplatform.Model.User;

public class ForumTopicDTO {
    private Long id;
    private String title;
    private String content;
    private User user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int viewCount;
    private int replyCount;
    private int upvotes;
    private int downvotes;
    private Set<String> tags;
    
    // Getters and Setters
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
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
    
    public int getViewCount() {
        return viewCount;
    }
    
    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }
    
    public int getReplyCount() {
        return replyCount;
    }
    
    public void setReplyCount(int replyCount) {
        this.replyCount = replyCount;
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
    
    public Set<String> getTags() {
        return tags;
    }
    
    public void setTags(Set<String> tags) {
        this.tags = tags;
    }
}

