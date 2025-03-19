package com.studyplatform.studyplatform.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.studyplatform.studyplatform.Model.Document;
import com.studyplatform.studyplatform.Repository.DocumentRepository;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;
    
    public List<Document> getDocumentsByUser(Long userId) {
        return documentRepository.findByUserIdOrderByUploadedAtDesc(userId);
    }
    
    public Document getDocumentById(Long id) {
        Optional<Document> document = documentRepository.findById(id);
        if (document.isPresent()) {
            return document.get();
        } else {
            throw new RuntimeException("Document not found with id: " + id);
        }
    }
    
    public Document saveDocument(Document document) {
        return documentRepository.save(document);
    }
    
    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }
    
    public Map<String, Integer> getDocumentStatsByUser(Long userId) {
        List<Document> documents = documentRepository.findByUserId(userId);
        
        int totalCount = documents.size();
        int pdfCount = 0;
        int imageCount = 0;
        int otherCount = 0;
        
        for (Document doc : documents) {
            String fileType = doc.getFileType().toLowerCase();
            if (fileType.contains("pdf")) {
                pdfCount++;
            } else if (fileType.contains("image") || fileType.contains("jpg") || 
                       fileType.contains("jpeg") || fileType.contains("png")) {
                imageCount++;
            } else {
                otherCount++;
            }
        }
        
        Map<String, Integer> stats = new HashMap<>();
        stats.put("total", totalCount);
        stats.put("pdf", pdfCount);
        stats.put("image", imageCount);
        stats.put("other", otherCount);
        
        return stats;
    }
}

