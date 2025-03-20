package com.studyplatform.studyplatform.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import com.studyplatform.studyplatform.Model.Comment;
import com.studyplatform.studyplatform.Model.Document;
import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Service.CommentService;
import com.studyplatform.studyplatform.Service.DocumentService;
import com.studyplatform.studyplatform.Service.UserService;
import com.studyplatform.studyplatform.dto.CommentRequest;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

  @Autowired
  private CommentService commentService;
  
  @Autowired
  private DocumentService documentService;
  
  @Autowired
  private UserService userService;
  
  @GetMapping("/document/{documentId}")
  public ResponseEntity<List<Comment>> getDocumentComments(@PathVariable Long documentId) {
      try {
          // Verify the document exists and user has access
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          String email = auth.getName();
          User user = userService.getUserByEmail(email);
          
          Document document = documentService.getDocumentById(documentId);
          
          // Check if document is accessible to the user
          if (!document.getUser().getId().equals(user.getId()) && !document.isPublic()) {
              return ResponseEntity.status(403).body(null);
          }
          
          List<Comment> comments = commentService.getCommentsByDocumentId(documentId);
          return ResponseEntity.ok(comments);
      } catch (Exception e) {
          // Return empty list instead of null
          return ResponseEntity.ok(java.util.Collections.emptyList());
      }
  }
  
  @PostMapping
  public ResponseEntity<?> addComment(@RequestBody CommentRequest request) {
      try {
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          String email = auth.getName();
          User user = userService.getUserByEmail(email);
          
          Document document = documentService.getDocumentById(request.getDocumentId());
          
          // Check if document is accessible to the user
          if (!document.getUser().getId().equals(user.getId()) && !document.isPublic()) {
              return ResponseEntity.status(403).body("You don't have permission to comment on this document");
          }
          
          Comment comment = new Comment();
          comment.setContent(request.getContent());
          comment.setDocument(document);
          comment.setUser(user);
          
          Comment savedComment = commentService.saveComment(comment);
          
          return ResponseEntity.ok(savedComment);
      } catch (Exception e) {
          return ResponseEntity.badRequest().body(e.getMessage());
      }
  }
  
  @PutMapping("/{id}")
  public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody CommentRequest request) {
      try {
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          String email = auth.getName();
          User user = userService.getUserByEmail(email);
          
          Comment comment = commentService.getCommentById(id);
          
          // Check if comment belongs to user
          if (!comment.getUser().getId().equals(user.getId())) {
              return ResponseEntity.status(403).body("You don't have permission to edit this comment");
          }
          
          comment.setContent(request.getContent());
          
          Comment updatedComment = commentService.saveComment(comment);
          
          return ResponseEntity.ok(updatedComment);
      } catch (Exception e) {
          return ResponseEntity.badRequest().body(e.getMessage());
      }
  }
  
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteComment(@PathVariable Long id) {
      try {
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          String email = auth.getName();
          User user = userService.getUserByEmail(email);
          
          Comment comment = commentService.getCommentById(id);
          
          // Check if comment belongs to user
          if (!comment.getUser().getId().equals(user.getId())) {
              return ResponseEntity.status(403).body("You don't have permission to delete this comment");
          }
          
          commentService.deleteComment(id);
          
          return ResponseEntity.ok().build();
      } catch (Exception e) {
          return ResponseEntity.badRequest().body(e.getMessage());
      }
  }
}

