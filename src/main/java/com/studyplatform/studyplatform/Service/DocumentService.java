package com.studyplatform.studyplatform.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.studyplatform.studyplatform.Model.Document;
import com.studyplatform.studyplatform.Repository.DocumentRepository;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private FileStorageService fileStorageService;
    
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

    public List<Document> searchDocuments(String query) {
        return documentRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query);
    }

    public List<Document> getPublicDocuments() {
        return documentRepository.findByIsPublicTrue();
    }

    public Map<String, Object> getDocumentActivityStats(Long documentId) {
        Document document = getDocumentById(documentId);
        
       
        Random random = new Random();
        int views = random.nextInt(100);
        int downloads = random.nextInt(20);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("views", views);
        stats.put("downloads", downloads);
        stats.put("lastAccessed", document.getUploadedAt());
        
        return stats;
    }
    public Map<String, Object> getDocumentSummary(Long documentId) {
        Document document = getDocumentById(documentId);
        
        // Get the file path from the document URL
        String fileUrl = document.getFileUrl();
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1); // Extract the file name
        
        // Get the actual file path from the file storage service
        String fullFilePath = fileStorageService.getFilePathAsString(fileName);
        
        String summaryText;
        
        try {
            if (document.getFileType().toLowerCase().contains("pdf")) {
                // Extract text from PDF
                String extractedText = extractTextFromPdf(fullFilePath);
                
                // Generate summary from extracted text
                summaryText = generateSummaryFromText(extractedText);
            } else if (document.getFileType().toLowerCase().contains("doc") || 
                      document.getFileType().toLowerCase().contains("word")) {
                // Extract text from Word document
                String extractedText = extractTextFromWord(fullFilePath);
                
                // Generate summary from extracted text
                summaryText = generateSummaryFromText(extractedText);
            } else {
                // Fallback for unsupported file types
                summaryText = "This " + document.getFileType() + " document contains " + 
                             (document.getFileSize() / 1024) + " KB of content.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback if text extraction fails
            summaryText = "This document appears to be a " + document.getFileType() + 
                         " file containing approximately " + (document.getFileSize() / 1024) + 
                         " KB of content.";
        }
        
        // Count words in the summary text, not the original document
        int wordCount = countWords(summaryText);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("documentId", documentId);
        summary.put("summaryText", summaryText);
        summary.put("generatedAt", java.time.LocalDateTime.now().toString());
        summary.put("wordCount", wordCount);
        
        return summary;
    }
    
    /**
     * Attaches a custom summary to a document
     * @param documentId The ID of the document
     * @param summaryText The custom summary text
     * @return The updated document with the summary
     */
    public Document attachSummary(Long documentId, String summaryText) {
        Document document = getDocumentById(documentId);
        
        // In a real implementation, you would:
        // 1. Create or update a summary entity in the database
        // 2. Associate it with the document
        
        // For this example, we'll update the document description to include the summary
        String currentDescription = document.getDescription();
        String updatedDescription;
        
        if (currentDescription == null || currentDescription.isEmpty()) {
            updatedDescription = "Summary: " + summaryText;
        } else if (currentDescription.contains("Summary:")) {
            // Replace existing summary
            updatedDescription = currentDescription.replaceAll("Summary:.*", "Summary: " + summaryText);
        } else {
            // Append summary to existing description
            updatedDescription = currentDescription + "\n\nSummary: " + summaryText;
        }
        
        document.setDescription(updatedDescription);
        return documentRepository.save(document);
    }
    
    /**
     * Extract text from a PDF file
     * @param filePath Path to the PDF file
     * @return Extracted text content
     */
    private String extractTextFromPdf(String filePath) {
        StringBuilder textBuilder = new StringBuilder();
        
        try {
            org.apache.pdfbox.pdmodel.PDDocument document = org.apache.pdfbox.pdmodel.PDDocument.load(new java.io.File(filePath));
            org.apache.pdfbox.text.PDFTextStripper stripper = new org.apache.pdfbox.text.PDFTextStripper();
            String text = stripper.getText(document);
            textBuilder.append(text);
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
            textBuilder.append("Error extracting text from PDF: ").append(e.getMessage());
        }
        
        return textBuilder.toString();
    }
    
    /**
     * Extract text from a Word document
     * @param filePath Path to the Word document
     * @return Extracted text content
     */
    private String extractTextFromWord(String filePath) {
        StringBuilder textBuilder = new StringBuilder();
        
        try {
            java.io.FileInputStream fis = new java.io.FileInputStream(filePath);
            org.apache.poi.xwpf.extractor.XWPFWordExtractor extractor = 
                new org.apache.poi.xwpf.extractor.XWPFWordExtractor(
                    new org.apache.poi.xwpf.usermodel.XWPFDocument(fis));
            String text = extractor.getText();
            textBuilder.append(text);
            extractor.close();
            fis.close();
        } catch (Exception e) {
            e.printStackTrace();
            textBuilder.append("Error extracting text from Word document: ").append(e.getMessage());
        }
        
        return textBuilder.toString();
    }
    
    /**
     * Generate a summary from the extracted text
     * @param text The extracted text content
     * @return A summary of the text limited to 30 words
     */
    private String generateSummaryFromText(String text) {
        // Simple summarization algorithm:
        // 1. Split text into sentences
        // 2. Score sentences based on word frequency
        // 3. Select top sentences for the summary
        // 4. Limit to 30 words
        
        if (text == null || text.trim().isEmpty()) {
            return "This document appears to be empty or contains non-textual content.";
        }
        
        // Split text into sentences
        String[] sentences = text.split("[.!?]\\s+");
        
        // If there are very few sentences, return a truncated version
        if (sentences.length <= 1) {
            return truncateToWordLimit(text, 30);
        }
        
        // Count word frequency
        Map<String, Integer> wordFrequency = new HashMap<>();
        for (String sentence : sentences) {
            String[] words = sentence.toLowerCase().split("\\s+");
            for (String word : words) {
                // Skip short words and common stop words
                if (word.length() <= 3 || isStopWord(word)) {
                    continue;
                }
                wordFrequency.put(word, wordFrequency.getOrDefault(word, 0) + 1);
            }
        }
        
        // Score sentences based on word frequency
        Map<String, Double> sentenceScores = new HashMap<>();
        for (String sentence : sentences) {
            if (sentence.trim().isEmpty()) continue;
            
            String[] words = sentence.toLowerCase().split("\\s+");
            double score = 0;
            for (String word : words) {
                if (wordFrequency.containsKey(word)) {
                    score += wordFrequency.get(word);
                }
            }
            // Normalize by sentence length to avoid bias towards longer sentences
            score = score / Math.max(1, words.length);
            sentenceScores.put(sentence, score);
        }
        
        // Sort sentences by score
        List<Map.Entry<String, Double>> sortedSentences = new ArrayList<>(sentenceScores.entrySet());
        sortedSentences.sort(Map.Entry.comparingByValue(Comparator.reverseOrder()));
        
        // Build summary with word count limit
        StringBuilder summaryBuilder = new StringBuilder();
        int wordCount = 0;
        
        for (Map.Entry<String, Double> entry : sortedSentences) {
            String sentence = entry.getKey();
            String[] words = sentence.split("\\s+");
            
            // Check if adding this sentence would exceed the word limit
            if (wordCount + words.length > 30) {
                // If we haven't added any sentences yet, add a truncated version of the first one
                if (wordCount == 0) {
                    return truncateToWordLimit(sentence, 30);
                }
                // Otherwise, stop adding sentences
                break;
            }
            
            // Add the sentence to the summary
            summaryBuilder.append(sentence).append(". ");
            wordCount += words.length;
        }
        
        return summaryBuilder.toString().trim();
    }
    
    private String truncateToWordLimit(String text, int wordLimit) {
        String[] words = text.split("\\s+");
        if (words.length <= wordLimit) {
            return text;
        }
        
        StringBuilder truncated = new StringBuilder();
        for (int i = 0; i < wordLimit; i++) {
            truncated.append(words[i]).append(" ");
        }
        
        return truncated.toString().trim() + "...";
    }

    private boolean isStopWord(String word) {
        Set<String> stopWords = Set.of("the", "and", "a", "an", "in", "on", "at", "to", "for", "with", 
                                      "by", "about", "as", "of", "that", "this", "is", "are", "was", "were");
        return stopWords.contains(word.toLowerCase());
    }
    
    private int countWords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }
        
        String[] words = text.split("\\s+");
        return words.length;
    }
    

}