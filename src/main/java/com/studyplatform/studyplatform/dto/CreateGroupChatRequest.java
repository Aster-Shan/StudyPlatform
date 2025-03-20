package com.studyplatform.studyplatform.dto;

import java.util.Set;

public class CreateGroupChatRequest {
    private String name;
    private String description;
    private Set<Long> participantIds;
    
    // Getters and Setters
    
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
    
    public Set<Long> getParticipantIds() {
        return participantIds;
    }
    
    public void setParticipantIds(Set<Long> participantIds) {
        this.participantIds = participantIds;
    }
}

