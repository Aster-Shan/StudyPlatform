package com.studyplatform.studyplatform.dto;

import java.util.Set;

import lombok.Data;

@Data
public class UserProfileDTO {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePictureUrl;
    private String bio;
    private String university;
    private String department;
    private Set<String> academicInterests;
    private boolean emailVerified;
    private boolean using2FA;
    private String provider;
}

