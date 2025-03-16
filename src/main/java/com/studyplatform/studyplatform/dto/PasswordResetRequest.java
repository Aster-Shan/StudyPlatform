package com.studyplatform.studyplatform.dto;

public class PasswordResetRequest {
    private String token;
    private String newPassword;
    
    // Default constructor (required for deserialization)
    public PasswordResetRequest() {}
    
    // Constructor with parameters
    public PasswordResetRequest(String token, String newPassword) {
        this.token = token;
        this.newPassword = newPassword;
    }
    
    // Getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}