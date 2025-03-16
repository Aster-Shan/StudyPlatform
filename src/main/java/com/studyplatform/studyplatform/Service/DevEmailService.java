package com.studyplatform.studyplatform.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("dev")  // Only use in development
public class DevEmailService implements IEmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(DevEmailService.class);
    
    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        logger.info("MOCK EMAIL: Password reset for: {}", to);
        logger.info("MOCK EMAIL: Reset link: {}", resetLink);
    }
    
    @Override
    public void sendVerificationEmail(String to, String confirmationUrl) {
        logger.info("MOCK EMAIL: Verification email for: {}", to);
        logger.info("MOCK EMAIL: Confirmation URL: {}", confirmationUrl);
    }
}