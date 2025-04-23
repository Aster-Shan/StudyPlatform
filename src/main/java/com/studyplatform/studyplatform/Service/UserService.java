package com.studyplatform.studyplatform.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.api.client.util.Value;
import com.studyplatform.studyplatform.Model.PasswordResetToken;
import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Model.VerificationToken;
import com.studyplatform.studyplatform.Repository.PasswordResetTokenRepository;
import com.studyplatform.studyplatform.Repository.UserRepository;
import com.studyplatform.studyplatform.Repository.VerificationTokenRepository;
import com.studyplatform.studyplatform.dto.ProfileUpdateRequest;
import com.studyplatform.studyplatform.dto.RegisterRequest;

import dev.samstevens.totp.code.CodeVerifier;

@Service

public class UserService {
    @Value("${app.frontend-url}")
    private String frontendUrl;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private CodeVerifier codeVerifier;

    @Autowired
private IEmailService emailService;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    private Map<String, String> temporary2FASecrets = new HashMap<>();

    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken");
        }
    
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setProvide(User.AuthProvider.LOCAL);
        user.setEnabled(false); // User starts as disabled until email verification
        
        User savedUser = userRepository.save(user);
        
        try {
            String token = UUID.randomUUID().toString();
            createVerificationToken(savedUser, token);
            String confirmationUrl = "http://localhost:3000/confirm?token=" + token;
            emailService.sendVerificationEmail(savedUser.getEmail(), confirmationUrl);
        } catch (Exception e) {
            // Log the error but don't fail the registration
            logger.error("Failed to send verification email: {}", e.getMessage());
            // Optionally, you could delete the user and throw an exception
            // userRepository.delete(savedUser);
            // throw new RuntimeException("Failed to send verification email. Please try again later.", e);
            
            // Or, for development, you could auto-enable the user
            user.setEnabled(true);
            userRepository.save(user);
        }
        
        return savedUser;
    }
    
    private void createVerificationToken(User user, String token) {
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setUser(user);
        verificationToken.setToken(token);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        verificationTokenRepository.save(verificationToken);
    }
    public User getUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("User not found with email"+email));
    }
    public void InitiatePasswordReset(String Email){
        User user =getUserByEmail(Email);
        String token= UUID.randomUUID().toString();
        LocalDateTime expiryDate =LocalDateTime.now().plusHours(24);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(expiryDate);
        passwordResetTokenRepository.save(resetToken);

        String resetLink="http://localhost:3000/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

    }
    public void resetPassword(String token, String newPassword) throws RuntimeException {
        System.out.println("Resetting password for token: " + token);
        
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("Token is required");
        }
        
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Token is invalid or expired"));
    
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }
    
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);
        
        System.out.println("Password reset successful for user: " + user.getEmail());
    }
    public User updateProfile(String email, ProfileUpdateRequest request){
        User user = getUserByEmail(email);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setBio(request.getBio());
        user.setAcademicInterests(request.getAcademicInterests());

        return userRepository.save(user);

    }
    public User updateProfilePicture(String email, String pictureUrl){
        User user = getUserByEmail(email);
        user.setProfilePictureUrl(pictureUrl);
        return userRepository.save(user);
        }
    public void saveTemporary2FASecret(String email, String secret) {
        temporary2FASecrets.put(email, secret);
        }
    
    public boolean verfiy2FACode(String email, String code){
         String secret;
            if (temporary2FASecrets.containsKey(email)){
                secret =temporary2FASecrets.get(email);
            }else{
                User user =getUserByEmail(email);
                secret =user.getSecret2FA();
            }
        return codeVerifier.isValidCode(secret, code);
        }
    public void enable2FA(String email) {
        User user = getUserByEmail(email);
        String secret = temporary2FASecrets.get(email);
        user.setSecret2FA(secret);
        user.setUsing2FA(true);
        userRepository.save(user);
        temporary2FASecrets.remove(email);
        }

    public void disable2FA(String email) {
        User user = getUserByEmail(email);
        user.setSecret2FA(null);
        user.setUsing2FA(false);
        userRepository.save(user);
        }
        public User updateUser(User user) {
            return userRepository.save(user);
        }
        public User save(User user) {
            return userRepository.save(user);
        }

        public boolean verifyEmail(String token) {
            System.out.println("Verifying email with token: " + token);
            VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));
            
            User user = verificationToken.getUser();
            user.setEnabled(true);
            userRepository.save(user);
            
            return true;
        }
        public User getUserById(Long id) {
            return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        }
        public boolean resendVerificationEmail(String email) {
            User user = getUserByEmail(email);
            
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            
            if (user.isEnabled()) {
                throw new RuntimeException("User is already verified");
            }
            
            // Delete existing verification tokens for this user
            verificationTokenRepository.deleteByUser(user);
            
            // Create a new verification token
            String token = UUID.randomUUID().toString();
            VerificationToken verificationToken = new VerificationToken();
            verificationToken.setToken(token);
            verificationToken.setUser(user);
            verificationToken.setExpiryDate(LocalDateTime.now().plusDays(1));
            verificationTokenRepository.save(verificationToken);
            
            // Send verification email
            String confirmationUrl = frontendUrl + "/confirm?token=" + token;
            emailService.sendVerificationEmail(user.getEmail(), confirmationUrl);
            
            return true;
        }
        
}
