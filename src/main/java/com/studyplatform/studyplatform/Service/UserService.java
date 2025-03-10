package com.studyplatform.studyplatform.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private CodeVerifier codeVerifier;

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
        user.setEnabled(false); // User starts as disabled
        
        User savedUser = userRepository.save(user);
        String token = UUID.randomUUID().toString();
        createVerificationToken(savedUser, token);
        String confirmationUrl = "http://localhost:3000/confirm?token=" + token;
        emailService.sendVerificationEmail(savedUser.getEmail(), confirmationUrl);
        
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
    public void resetPassword(String token,String newPassword) throws RuntimeErrorException{
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
        .orElseThrow(()-> new RuntimeErrorException(null, "Token is Invalid"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);

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
}
