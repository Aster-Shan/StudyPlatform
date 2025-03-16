package com.studyplatform.studyplatform.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @GetMapping("/email")
    public ResponseEntity<?> testEmail() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("your-email@example.com"); // Your email for testing
            message.setSubject("Test Email");
            message.setText("This is a test email from your application.");
            mailSender.send(message);
            return ResponseEntity.ok("Test email sent successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send test email: " + e.getMessage());
        }
    }
}