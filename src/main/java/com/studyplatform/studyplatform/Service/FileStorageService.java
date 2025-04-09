package com.studyplatform.studyplatform.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            
            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path targetLocation = uploadPath.resolve(fileName);
            
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/files/")
                    .path(fileName)
                    .toUriString();

            return fileUrl;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename(), ex);
        }
    }
    
    public void deleteFile(String fileUrl) {
        try {
            // Extract the file name from the URL
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            
            // Delete the file
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file. Please try again!", ex);
        }
    }
    
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found: " + fileName, ex);
        }
    }
    
    /**
     * Get the full file path for a stored file
     * @param fileName The name of the file
     * @return The full path to the file as a Path object
     */
    public Path getFilePath(String fileName) {
        return Paths.get(uploadDir).toAbsolutePath().normalize().resolve(fileName);
    }
    
    /**
     * Get the full file path for a stored file as a string
     * @param fileName The name of the file
     * @return The full path to the file as a String
     */
    public String getFilePathAsString(String fileName) {
        return getFilePath(fileName).toString();
    }
}
