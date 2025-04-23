package com.studyplatform.studyplatform.Service;

import java.io.UnsupportedEncodingException;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService implements IEmailService {
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.email.from}")
    private String fromEmail;
    
    @Value("${spring.mail.from.name:Study Platform}")
    private String fromName;

    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject("Password Reset Request");
            
            String htmlContent = 
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;'>" +
                "<h2 style='color: #333366;'>Password Reset Request</h2>" +
                "<p>Hello,</p>" +
                "<p>We received a request to reset your password. Click the button below to create a new password:</p>" +
                "<p style='text-align: center;'>" +
                "<a href='" + resetLink + "' style='display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>Reset Password</a>" +
                "</p>" +
                "<p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>" +
                "<p>This link will expire in 24 hours.</p>" +
                "<p>Best regards,<br>Your Study Platform Team</p>" +
                "</div>";
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Override
    public void sendVerificationEmail(String to, String confirmationUrl) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject("Confirm Your Registration");
            
            String htmlContent = 
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;'>" +
                "<h2 style='color: #333366;'>Welcome to Study Platform!</h2>" +
                "<p>Thank you for registering. Please confirm your email address by clicking the button below:</p>" +
                "<p style='text-align: center;'>" +
                "<a href='" + confirmationUrl + "' style='display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>Verify Email</a>" +
                "</p>" +
                "<p>If you didn't create an account, please ignore this email.</p>" +
                "<p>Best regards,<br>Your Study Platform Team</p>" +
                "</div>";
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
    
    @Override
    public void sendWelcomeEmail(String to, String firstName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject("Welcome to Study Platform!");
            
            String htmlContent = 
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;'>" +
                "<h2 style='color: #333366;'>Welcome to Study Platform, " + firstName + "!</h2>" +
                "<p>Thank you for verifying your email address. Your account is now active.</p>" +
                "<p>You can now access all features of our platform:</p>" +
                "<ul>" +
                "<li>Create and manage study materials</li>" +
                "<li>Collaborate with other students</li>" +
                "<li>Track your progress</li>" +
                "<li>And much more!</li>" +
                "</ul>" +
                "<p style='text-align: center;'>" +
                "<a href='http://localhost:3000/dashboard' style='display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>Go to Dashboard</a>" +
                "</p>" +
                "<p>Best regards,<br>Your Study Platform Team</p>" +
                "</div>";
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }
    
    @Override
    public void sendLoginNotificationEmail(String to, String ipAddress, String deviceInfo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject("New Login Detected");
            
            String htmlContent = 
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;'>" +
                "<h2 style='color: #333366;'>New Login Detected</h2>" +
                "<p>Hello,</p>" +
                "<p>We detected a new login to your Study Platform account.</p>" +
                "<p><strong>IP Address:</strong> " + ipAddress + "</p>" +
                "<p><strong>Device:</strong> " + deviceInfo + "</p>" +
                "<p><strong>Time:</strong> " + java.time.LocalDateTime.now() + "</p>" +
                "<p>If this was you, you can ignore this email. If you didn't log in recently, please secure your account immediately by changing your password.</p>" +
                "<p style='text-align: center;'>" +
                "<a href='http://localhost:3000/reset-password' style='display: inline-block; background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>Secure My Account</a>" +
                "</p>" +
                "<p>Best regards,<br>Your Study Platform Team</p>" +
                "</div>";
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send login notification email", e);
        }
    }
}