package com.studyplatform.studyplatform.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.studyplatform.studyplatform.Model.Document;
import com.studyplatform.studyplatform.Model.User;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUserOrderByUploadedAtDesc(User user);
    Optional<Document> findByIdAndUser(Long id, User user);
}