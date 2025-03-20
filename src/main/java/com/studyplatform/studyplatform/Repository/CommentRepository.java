package com.studyplatform.studyplatform.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.studyplatform.studyplatform.Model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByDocumentIdOrderByCreatedAtDesc(Long documentId);
    
    List<Comment> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    long countByDocumentId(Long documentId);
}

