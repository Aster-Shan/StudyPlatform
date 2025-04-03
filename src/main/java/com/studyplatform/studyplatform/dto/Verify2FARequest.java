package com.studyplatform.studyplatform.dto;

import javax.validation.constraints.NotBlank;

public class Verify2FARequest {
    
    @NotBlank(message = "Temporary token is required")
    private String tempToken;
    
    @NotBlank(message = "Verification code is required")
    private String code;
    
    // Getters and setters
    public String getTempToken() {
        return tempToken;
    }
    
    public void setTempToken(String tempToken) {
        this.tempToken = tempToken;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
}

