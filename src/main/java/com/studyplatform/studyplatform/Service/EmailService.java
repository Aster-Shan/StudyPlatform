package com.studyplatform.studyplatform.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetLink){
        SimpleMailMessage message= new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click the link below:\n" + resetLink + 
                        "\n\nIf you did not request a password reset, please ignore this email.");

       mailSender.send(message);
    }
    public void sendVerificationEmail(String to, String confirmationUrl){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Confim Registration");
        message.setText("To confirm your registration, please click the link below:\n"+confirmationUrl);
        mailSender.send(message);
    }

}
