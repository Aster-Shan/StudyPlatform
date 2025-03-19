package com.studyplatform.studyplatform.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.studyplatform.studyplatform.Model.Document;
import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Service.DocumentService;
import com.studyplatform.studyplatform.Service.FileStorageService;
import com.studyplatform.studyplatform.Service.UserService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<Document>> getUserDocuments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        List<Document> documents = documentService.getDocumentsByUser(user.getId());
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Integer>> getDocumentStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        Map<String, Integer> stats = documentService.getDocumentStatsByUser(user.getId());
        return ResponseEntity.ok(stats);
    }
    
    @PostMapping
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description) {
        
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userService.getUserByEmail(email);
            
            // Store the file
            String fileUrl = fileStorageService.storeFile(file);
            
            // Create document record
            Document document = new Document();
            document.setName(file.getOriginalFilename());
            document.setFileUrl(fileUrl);
            document.setFileType(file.getContentType());
            document.setFileSize(file.getSize());
            document.setDescription(description);
            document.setUser(user);
            
            Document savedDocument = documentService.saveDocument(document);
            
            return ResponseEntity.ok(savedDocument);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userService.getUserByEmail(email);
            
            Document document = documentService.getDocumentById(id);
            
            // Check if document belongs to user
            if (document.getUser().getId() != user.getId()) {
                return ResponseEntity.status(403).body("You don't have permission to delete this document");
            }
            
            // Delete file from storage
            fileStorageService.deleteFile(document.getFileUrl());
            
            // Delete document record
            documentService.deleteDocument(id);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadDocument(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userService.getUserByEmail(email);
            
            Document document = documentService.getDocumentById(id);
            
            // Check if document belongs to user
            if (document.getUser().getId() != user.getId()) {
                return ResponseEntity.status(403).body("You don't have permission to access this document");
            }
            
            // Extract filename from URL
            String fileName = document.getFileUrl().substring(document.getFileUrl().lastIndexOf("/") + 1);
            
            // Return the file URL or redirect to the file controller
            Map<String, String> response = new HashMap<>();
            response.put("url", "/api/files/" + fileName);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

