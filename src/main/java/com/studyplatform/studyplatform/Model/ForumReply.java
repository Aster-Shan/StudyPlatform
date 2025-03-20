package com.studyplatform.studyplatform.Model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;


@Entity
@Table(name = "forum_replies")
public class ForumReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = false)
    private ForumTopic topic;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(nullable = false)
    private boolean isAcceptedAnswer = false;
    
    @ElementCollection
    private Set<Long> upvotedBy = new HashSet<>();
    
    @ElementCollection
    private Set<Long> downvotedBy = new HashSet<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
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

    public ForumTopic getTopic() {
        return topic;
    }

    public void setTopic(ForumTopic topic) {
        this.topic = topic;
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

    public boolean isAcceptedAnswer() {
        return isAcceptedAnswer;
    }

    public void setAcceptedAnswer(boolean isAcceptedAnswer) {
        this.isAcceptedAnswer = isAcceptedAnswer;
    }

    public Set<Long> getUpvotedBy() {
        return upvotedBy;
    }

    public void setUpvotedBy(Set<Long> upvotedBy) {
        this.upvotedBy = upvotedBy;
    }
    
    public int getUpvotes() {
        return this.upvotedBy.size();
    }
    
    public void addUpvote(Long userId) {
        this.downvotedBy.remove(userId); // Remove downvote if exists
        this.upvotedBy.add(userId);
    }
    
    public void removeUpvote(Long userId) {
        this.upvotedBy.remove(userId);
    }

    public Set<Long> getDownvotedBy() {
        return downvotedBy;
    }

    public void setDownvotedBy(Set<Long> downvotedBy) {
        this.downvotedBy = downvotedBy;
    }
    
    public int getDownvotes() {
        return this.downvotedBy.size();
    }
    
    public void addDownvote(Long userId) {
        this.upvotedBy.remove(userId); // Remove upvote if exists
        this.downvotedBy.add(userId);
    }
    
    public void removeDownvote(Long userId) {
        this.downvotedBy.remove(userId);
    }
}

