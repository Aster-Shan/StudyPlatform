package com.studyplatform.studyplatform.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
  
  @GetMapping("/test")
  public ResponseEntity<String> testEndpoint() {
      return ResponseEntity.ok("DocumentController is working!");
  }

  @GetMapping(value = "/test-json", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Map<String, Object>> testJsonEndpoint() {
      System.out.println("=== Test JSON endpoint called ===");
      Map<String, Object> response = new HashMap<>();
      response.put("message", "This is a test JSON response");
      response.put("timestamp", System.currentTimeMillis());
      return ResponseEntity
          .ok()
          .contentType(MediaType.APPLICATION_JSON)
          .body(response);
  }
  
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
  
  @GetMapping("/{documentId}")
  public ResponseEntity<?> getDocumentById(@PathVariable("documentId") Long documentId) {
      try {
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          String email = auth.getName();
          User user = userService.getUserByEmail(email);
      
          Document document = documentService.getDocumentById(documentId);
      
          // Check if document is accessible to the user
          if (!document.getUser().getId().equals(user.getId()) && !document.isPublic()) {
              return ResponseEntity.status(403).body("You don't have permission to access this document");
          }
      
          return ResponseEntity.ok(document);
      } catch (Exception e) {
          return ResponseEntity.badRequest().body(e.getMessage());
      }
  }
  
  @PostMapping
  public ResponseEntity<?> uploadDocument(
          @RequestParam("file") MultipartFile file,
          @RequestParam(value = "description", required = false) String description,
          @RequestParam(value = "isPublic", required = false, defaultValue = "false") boolean isPublic) {
      
      try {
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          String email = auth.getName();
          User user = userService.getUserByEmail(email);
          
          // Log the received isPublic value
          System.out.println("Received isPublic value: " + isPublic);
          
          // Store the file
          String fileUrl = fileStorageService.storeFile(file);
          
          // Create document record
          Document document = new Document();
          document.setName(file.getOriginalFilename());
          document.setFileUrl(fileUrl);
          document.setFileType(file.getContentType());
          document.setFileSize(file.getSize());
          document.setDescription(description);
          document.setPublic(isPublic); // Set the public flag
          document.setUser(user);
          
          Document savedDocument = documentService.saveDocument(document);
          
          return ResponseEntity.ok(savedDocument);
      } catch (Exception e) {
          return ResponseEntity.badRequest().body(e.getMessage());
      }
  }
  
  @PutMapping("/{id}/visibility")
  public ResponseEntity<?> updateDocumentVisibility(
          @PathVariable Long id,
          @RequestParam("isPublic") boolean isPublic) {
      try {
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          String email = auth.getName();
          User user = userService.getUserByEmail(email);
          
          Document document = documentService.getDocumentById(id);
          
          // Check if document belongs to user
          if (!document.getUser().getId().equals(user.getId())) {
              return ResponseEntity.status(403).body("You don't have permission to modify this document");
          }
          
          document.setPublic(isPublic);
          Document updatedDocument = documentService.saveDocument(document);
          
          return ResponseEntity.ok(updatedDocument);
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
          if (!document.getUser().getId().equals(user.getId())) {
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
          
          // Check if document belongs to user or is public
          if (!document.getUser().getId().equals(user.getId()) && !document.isPublic()) {
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

  @GetMapping("/search")
  public ResponseEntity<List<Document>> searchDocuments(@RequestParam("q") String query) {
      try {
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          // Only return documents that are public or belong to the current user
          String email = auth.getName();
          User user = userService.getUserByEmail(email);
          
          List<Document> documents = documentService.searchDocuments(query);
          // Filter to only include public documents or documents owned by the current user
          documents.removeIf(doc -> !doc.isPublic() && !doc.getUser().getId().equals(user.getId()));
          
          return ResponseEntity.ok(documents);
      } catch (Exception e) {
          // Return an empty list instead of null
          return ResponseEntity.ok(java.util.Collections.emptyList());
      }
  }

  @GetMapping("/public")
  public ResponseEntity<List<Document>> getPublicDocuments() {
      try {
          List<Document> documents = documentService.getPublicDocuments();
          return ResponseEntity.ok(documents);
      } catch (Exception e) {
          // Return an empty list instead of null
          return ResponseEntity.ok(java.util.Collections.emptyList());
      }
  }

  @GetMapping("/{id}/activity")
  public ResponseEntity<?> getDocumentActivity(@PathVariable Long id) {
      try {
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          String email = auth.getName();
          User user = userService.getUserByEmail(email);
      
          Document document = documentService.getDocumentById(id);
      
          // Check if document is accessible to the user
          if (!document.getUser().getId().equals(user.getId()) && !document.isPublic()) {
              return ResponseEntity.status(403).body("You don't have permission to access this document");
          }
      
          Map<String, Object> activityStats = documentService.getDocumentActivityStats(id);
          return ResponseEntity.ok(activityStats);
      } catch (Exception e) {
          return ResponseEntity.badRequest().body(e.getMessage());
      }
  }
  
  /**
   * Get an auto-generated summary for a document
   */
  @GetMapping(value = "/{id}/summary", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> getDocumentSummary(@PathVariable Long id) {
      System.out.println("=== Document summary endpoint called for ID: " + id + " ===");
      try {
          // For development, skip authentication check
          Document document = documentService.getDocumentById(id);
          System.out.println("Document found: " + document.getName());
      
          Map<String, Object> summary = documentService.getDocumentSummary(id);
          System.out.println("Summary generated: " + summary);
          return ResponseEntity
              .ok()
              .contentType(MediaType.APPLICATION_JSON)
              .body(summary);
      } catch (Exception e) {
          System.out.println("Error in summary endpoint: " + e.getMessage());
          e.printStackTrace();
          return ResponseEntity
              .badRequest()
              .contentType(MediaType.APPLICATION_JSON)
              .body(Map.of("error", e.getMessage()));
      }
  }
  
  /**
   * Attach a custom summary to a document
   */
  @PostMapping(value = "/{id}/summary", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> attachDocumentSummary(
        @PathVariable Long id,
        @RequestBody Map<String, String> payload) {
    try {
        // For development, skip authentication check
        Document document = documentService.getDocumentById(id);
        
        String summaryText = payload.get("summary");
        if (summaryText == null || summaryText.trim().isEmpty()) {
            return ResponseEntity
                .badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", "Summary text cannot be empty"));
        }
        
        Document updatedDocument = documentService.attachSummary(id, summaryText);
        
        return ResponseEntity
            .ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(updatedDocument);
    } catch (Exception e) {
        return ResponseEntity
            .badRequest()
            .contentType(MediaType.APPLICATION_JSON)
            .body(Map.of("error", e.getMessage()));
    }
}
}
