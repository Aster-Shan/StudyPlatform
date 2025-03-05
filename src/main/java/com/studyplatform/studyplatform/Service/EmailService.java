package com.studyplatform.studyplatform.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.exception.EmailServiceException;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private GmailService gmailService;

    public void sendVerificationEmail(User user) {
        if (user == null || user.getEmail() == null || user.getVerificationToken() == null) {
            logger.error("Invalid user data for sending verification email");
            throw new EmailServiceException("Invalid user data for sending verification email");
        }
    
        String subject = "Verify your email";
        String content = "Please click on the link to verify your email: "
                + "http://localhost:3000/verify-email?token=" + user.getVerificationToken();
    
        try {
            logger.info("Attempting to send email via GmailService to: {}", user.getEmail());
            gmailService.sendEmail(user.getEmail(), subject, content);
            logger.info("Verification email sent successfully to: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}", user.getEmail(), e);
            throw new EmailServiceException("Failed to send verification email", e);
        }
    }
    
    public void sendNotification(User user, String subject, String content) {
        if (user == null || user.getEmail() == null || subject == null || content == null) {
            logger.error("Invalid data for sending notification email");
            throw new EmailServiceException("Invalid data for sending notification email");
        }

        try {
            gmailService.sendEmail(user.getEmail(), subject, content);
            logger.info("Notification email sent successfully to: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send notification email to: {}", user.getEmail(), e);
            throw new EmailServiceException("Failed to send notification email", e);
        }
    }

    public void sendPasswordResetEmail(User user, String resetToken) {
        if (user == null || user.getEmail() == null || resetToken == null) {
            logger.error("Invalid data for sending password reset email");
            throw new EmailServiceException("Invalid data for sending password reset email");
        }

        String subject = "Reset your password";
        String content = "Please click on the link to reset your password: "
                + "http://localhost:3000/reset-password?token=" + resetToken;

        try {
            gmailService.sendEmail(user.getEmail(), subject, content);
            logger.info("Password reset email sent successfully to: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", user.getEmail(), e);
            throw new EmailServiceException("Failed to send password reset email", e);
        }
    }
}

