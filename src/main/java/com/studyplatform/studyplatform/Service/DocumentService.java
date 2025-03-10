package com.studyplatform.studyplatform.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.studyplatform.studyplatform.Model.Document;
import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Repository.DocumentRepository;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private UserService userService;
    
    public Document uploadDocument(MultipartFile file, String description, String email) {
        User user = userService.getUserByEmail(email);

        String fileUrl = fileStorageService.storeFile(file);
        Document document = new Document();
        document.setName(file.getOriginalFilename());
        document.setFileUrl(fileUrl);
        document.setFileType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setDescription(description);
        document.setUploadedAt(LocalDateTime.now());
        document.setUser(user);
        
        return documentRepository.save(document);
    }
    
    public List<Document> getUserDocuments(String email) {
        User user = userService.getUserByEmail(email);
        return documentRepository.findByUserOrderByUploadedAtDesc(user);
    }
    
    public Document getDocument(Long id, String email) {
        User user = userService.getUserByEmail(email);
        return documentRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Document not found or access denied"));
    }
    
    public void deleteDocument(Long id, String email) {
        User user = userService.getUserByEmail(email);
        Document document = documentRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Document not found or access denied"));
        
        documentRepository.delete(document);
    }
}