package com.studyplatform.studyplatform.Controller;


import java.net.MalformedURLException;
import java.nio.file.Path;
import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.studyplatform.studyplatform.Model.Document;
import com.studyplatform.studyplatform.Service.DocumentService;
import com.studyplatform.studyplatform.Service.FileStorageService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;
    
    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description,
            Principal principal) {
        
        Document document = documentService.uploadDocument(file, description, principal.getName());
        return ResponseEntity.ok(document);
    }
    
    @GetMapping
    public ResponseEntity<List<Document>> getUserDocuments(Principal principal) {
        List<Document> documents = documentService.getUserDocuments(principal.getName());
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(@PathVariable Long id, Principal principal) {
        Document document = documentService.getDocument(id, principal.getName());
        return ResponseEntity.ok(document);
    }
    
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id, Principal principal) {
        Document document = documentService.getDocument(id, principal.getName());
        
        try {
            Path filePath = fileStorageService.getFilePath(document.getFileUrl());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(document.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getName() + "\"")
                    .body(resource);
            } else {
                throw new RuntimeException("File not found: " + document.getFileUrl());
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found: " + document.getFileUrl(), ex);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id, Principal principal) {
        documentService.deleteDocument(id, principal.getName());
        return ResponseEntity.ok().build();
    }
}