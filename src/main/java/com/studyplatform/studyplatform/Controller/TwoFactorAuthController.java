package com.studyplatform.studyplatform.Controller;

import java.security.Principal;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.studyplatform.studyplatform.Service.UserService;

import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrData.Builder;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.secret.SecretGenerator;

@RestController
@RequestMapping("/api/2fa")
public class TwoFactorAuthController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private SecretGenerator secretGenerator;
    
    @Autowired
    private QrGenerator qrGenerator;
    
    @Autowired
    private CodeVerifier codeVerifier;

    @PostMapping("/setup")
    public ResponseEntity<?> setup(Principal principal) throws QrGenerationException {
        String email = principal.getName();
        String secret = secretGenerator.generate();
        
        // Save the secret temporarily (not permanently until verified)
        userService.saveTemporary2FASecret(email, secret);
        
        // Generate QR code
        String issuer = "UserManagement";
        QrData data = new Builder()
            .label(email)
            .secret(secret)
            .issuer(issuer)
            .algorithm(HashingAlgorithm.SHA1)
            .digits(6)
            .period(30)
            .build();
        
        byte[] qrCode = qrGenerator.generate(data);
        String qrCodeData = "data:image/png;base64," + Base64.getEncoder().encodeToString(qrCode);
        
        Map<String, String> response = new HashMap<>();
        response.put("secret", secret);
        response.put("qrCodeData", qrCodeData);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String code, Principal principal) {
        String email = principal.getName();
        boolean isValid = userService.verfiy2FACode(email, code);
        
        if (isValid) {
            userService.enable2FA(email);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().body("Invalid verification code");
        }
    }
    
    @PostMapping("/disable")
    public ResponseEntity<?> disable(Principal principal) {
        String email = principal.getName();
        userService.disable2FA(email);
        return ResponseEntity.ok().build();
    }
}