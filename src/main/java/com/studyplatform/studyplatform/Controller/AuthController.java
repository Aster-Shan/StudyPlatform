package com.studyplatform.studyplatform.Controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.studyplatform.studyplatform.Config.security.JwtTokenProvider;
import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Service.UserService;
import com.studyplatform.studyplatform.dto.LoginRequest;
import com.studyplatform.studyplatform.dto.RegisterRequest;
import com.studyplatform.studyplatform.dto.Verify2FARequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

      private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            
            // Don't generate a token yet since the user needs to verify their email
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful! Please check your email to verify your account.");
            response.put("email", user.getEmail());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Registration error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Authenticate with username and password
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            User user = userService.getUserByEmail(request.getEmail());
            
            // Check if user is enabled (email verified)
            if (!user.isEnabled()) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Email not verified");
                response.put("message", "Please check your email to verify your account");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            
            // Check if 2FA is enabled
            if (user.isUsing2FA()) {
                // Generate a temporary token with short expiration
                String tempToken = jwtTokenProvider.generateTempToken(user.getEmail());
                
                Map<String, Object> response = new HashMap<>();
                response.put("requires2FA", true);
                response.put("tempToken", tempToken);
                
                return ResponseEntity.ok(response);
            } else {
                // Generate a regular token
                String token = jwtTokenProvider.generateToken(user.getEmail());
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", user);
                
                return ResponseEntity.ok(response);
            }
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        System.out.println("Verification endpoint called with token: " + token);
        try {
            boolean verified = userService.verifyEmail(token);
            if (verified) {
                return ResponseEntity.ok().body(Map.of("message", "Email verified successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Email verification failed"));
            }
        } catch (Exception e) {
            System.out.println("Verification error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage()));
        }
    }
    @PostMapping("/resend-verification")
public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    if (email == null || email.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
    }
    
    try {
        boolean sent = userService.resendVerificationEmail(email);
        if (sent) {
            return ResponseEntity.ok(Map.of("message", "Verification email has been resent"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to resend verification email"));
        }
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage()));
    }
}


    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2FA(@RequestBody Verify2FARequest request) {
        // Validate temp token
        if (!jwtTokenProvider.validateToken(request.getTempToken())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        
        String email = jwtTokenProvider.getEmailFromToken(request.getTempToken());
        User user = userService.getUserByEmail(email);
        
        // Verify 2FA code
        if (userService.verfiy2FACode(email, request.getCode())) {
            // Generate a regular token
            String token = jwtTokenProvider.generateToken(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid verification code");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            userService.InitiatePasswordReset(email);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}