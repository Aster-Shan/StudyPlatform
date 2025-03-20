package com.studyplatform.studyplatform.Repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.studyplatform.studyplatform.Model.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findByUserId(Long userId);
    
    List<Document> findByUserIdOrderByUploadedAtDesc(Long userId);

    @Query("SELECT d FROM Document d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Document> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(@Param("query") String query);

    List<Document> findByIsPublicTrue();

    // These methods would normally be implemented with actual view/download tracking tables
    // For now, we'll return dummy data in the service
    @Query("SELECT COUNT(d) FROM Document d WHERE d.id = :documentId")
    int getDocumentViews(@Param("documentId") Long documentId);

    @Query("SELECT COUNT(d) FROM Document d WHERE d.id = :documentId")
    int getDocumentDownloads(@Param("documentId") Long documentId);

    @Query("SELECT d.uploadedAt FROM Document d WHERE d.id = :documentId")
    Date getLastAccessDate(@Param("documentId") Long documentId);
}

