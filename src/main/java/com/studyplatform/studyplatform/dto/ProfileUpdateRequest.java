package com.studyplatform.studyplatform.dto;
import java.util.Set;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String bio;
    private Set<String> academicInterests;
}