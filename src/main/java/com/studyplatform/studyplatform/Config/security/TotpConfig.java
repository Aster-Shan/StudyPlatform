package com.studyplatform.studyplatform.Config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;

@Configuration
public class TotpConfig {

    @Bean
    public TimeProvider timeProvider() {
        return new SystemTimeProvider();
    }
    
    @Bean
    public HashingAlgorithm hashingAlgorithm() {
        return HashingAlgorithm.SHA1;
    }
    
    @Bean
    public CodeGenerator codeGenerator() {
        return new DefaultCodeGenerator(hashingAlgorithm());
    }
    
    @Bean
    public CodeVerifier codeVerifier() {
        return new DefaultCodeVerifier(codeGenerator(), timeProvider());
    }
    
    @Bean
    public SecretGenerator secretGenerator() {
        return new DefaultSecretGenerator();
    }
    
    @Bean
    public QrGenerator qrGenerator() {
        return new ZxingPngQrGenerator();
    }
}