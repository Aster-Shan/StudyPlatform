package com.studyplatform.studyplatform.dto;
import lombok.Data;

@Data
public class Verify2FARequest {
    private String email;
    private String code;
    private String tempToken;
}
