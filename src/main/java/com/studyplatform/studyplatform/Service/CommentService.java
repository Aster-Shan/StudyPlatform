package com.studyplatform.studyplatform.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.studyplatform.studyplatform.Model.Comment;
import com.studyplatform.studyplatform.Repository.CommentRepository;

@Service
public class CommentService {

  @Autowired
  private CommentRepository commentRepository;
  
  public List<Comment> getCommentsByDocumentId(Long documentId) {
      return commentRepository.findByDocumentIdOrderByCreatedAtDesc(documentId);
  }
  
  public List<Comment> getCommentsByUserId(Long userId) {
      return commentRepository.findByUserIdOrderByCreatedAtDesc(userId);
  }
  
  public Comment getCommentById(Long id) {
      Optional<Comment> comment = commentRepository.findById(id);
      if (comment.isPresent()) {
          return comment.get();
      } else {
          throw new RuntimeException("Comment not found with id: " + id);
      }
  }
  
  public Comment saveComment(Comment comment) {
      return commentRepository.save(comment);
  }
  
  public void deleteComment(Long id) {
      commentRepository.deleteById(id);
  }
  
  public long getCommentCountForDocument(Long documentId) {
      return commentRepository.countByDocumentId(documentId);
  }
}

