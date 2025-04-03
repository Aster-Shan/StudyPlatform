package com.studyplatform.studyplatform.Controller;

import com.studyplatform.studyplatform.dto.ImageGenerationRequest;
import com.studyplatform.studyplatform.dto.ImageGenerationResponse;
import com.studyplatform.studyplatform.dto.TextExtractionResponse;
import com.studyplatform.studyplatform.Service.AIImageService;
import com.studyplatform.studyplatform.Service.TextExtractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class AIImageController {

    private final AIImageService aiImageService;
    private final TextExtractionService textExtractionService;

    @Autowired
    public AIImageController(AIImageService aiImageService, TextExtractionService textExtractionService) {
        this.aiImageService = aiImageService;
        this.textExtractionService = textExtractionService;
    }

    @PostMapping("/generate-image")
    public ResponseEntity<ImageGenerationResponse> generateImage(@RequestBody ImageGenerationRequest request) {
        try {
            String imageUrl = aiImageService.generateImage(request.getPrompt());
            return ResponseEntity.ok(new ImageGenerationResponse(imageUrl));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ImageGenerationResponse(null, "Failed to generate image: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/extract-text", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TextExtractionResponse> extractText(@RequestParam("document") MultipartFile file) {
        try {
            String extractedText = textExtractionService.extractText(file);
            return ResponseEntity.ok(new TextExtractionResponse(extractedText));
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new TextExtractionResponse(null, "Failed to extract text: " + e.getMessage()));
        }
    }
}

