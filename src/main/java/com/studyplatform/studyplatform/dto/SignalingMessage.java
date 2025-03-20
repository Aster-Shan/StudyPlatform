package com.studyplatform.studyplatform.dto;

public class SignalingMessage {
    private String type;
    private String senderPeerId;
    private String targetPeerId;
    private Object payload;
    
    // Getters and Setters
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getSenderPeerId() {
        return senderPeerId;
    }
    
    public void setSenderPeerId(String senderPeerId) {
        this.senderPeerId = senderPeerId;
    }
    
    public String getTargetPeerId() {
        return targetPeerId;
    }
    
    public void setTargetPeerId(String targetPeerId) {
        this.targetPeerId = targetPeerId;
    }
    
    public Object getPayload() {
        return payload;
    }
    
    public void setPayload(Object payload) {
        this.payload = payload;
    }
}

