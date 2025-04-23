package com.studyplatform.studyplatform.Service;

public interface IEmailService {
    void sendPasswordResetEmail(String to, String resetLink);
    void sendVerificationEmail(String to, String confirmationUrl);
    void sendWelcomeEmail(String to, String firstName);
    void sendLoginNotificationEmail(String to, String ipAddress, String deviceInfo);
}