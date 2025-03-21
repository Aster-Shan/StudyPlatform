package com.studyplatform.studyplatform.Controller;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Service.FileStorageService;
import com.studyplatform.studyplatform.Service.UserService;
import com.studyplatform.studyplatform.dto.PasswordResetRequest;
import com.studyplatform.studyplatform.dto.ProfileUpdateRequest;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Principal principal) {
        User user = userService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody ProfileUpdateRequest request, Principal principal) {
        User updatedUser = userService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/profile/picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file, Principal principal) {
        String fileUrl = fileStorageService.storeFile(file);
        User user = userService.updateProfilePicture(principal.getName(), fileUrl);
        return ResponseEntity.ok(fileUrl);
    }
    
    @DeleteMapping("/picture")
    public ResponseEntity<?> deleteProfilePicture(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        // Delete profile picture if exists
        if (user.getProfilePictureUrl() != null) {
            fileStorageService.deleteFile(user.getProfilePictureUrl());
            user.setProfilePictureUrl(null);
            userService.save(user);
        }
        
        return ResponseEntity.ok().body("Profile picture deleted successfully");
    } // This closing brace was missing
   
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        System.out.println("Received reset request: token=" + request.getToken() + ", newPassword length=" + (request.getNewPassword() != null ? request.getNewPassword().length() : "null"));
        
        Map<String, String> response = new HashMap<>();
        
        try {
            if (request.getToken() == null || request.getToken().isEmpty()) {
                response.put("message", "Token is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (request.getNewPassword() == null || request.getNewPassword().isEmpty()) {
                response.put("message", "New password is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            userService.resetPassword(request.getToken(), request.getNewPassword());
            response.put("message", "Password reset successful");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            System.out.println("Reset password error: " + e.getMessage());
            e.printStackTrace();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}


