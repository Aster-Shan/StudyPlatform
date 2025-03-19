package com.studyplatform.studyplatform.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.studyplatform.studyplatform.Model.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findByUserId(Long userId);
    
    List<Document> findByUserIdOrderByUploadedAtDesc(Long userId);
}

