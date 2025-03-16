package com.studyplatform.studyplatform.Service;

public interface IEmailService {
    void sendPasswordResetEmail(String to, String resetLink);
    void sendVerificationEmail(String to, String confirmationUrl);
}