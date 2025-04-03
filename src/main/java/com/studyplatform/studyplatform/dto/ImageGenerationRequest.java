package com.studyplatform.studyplatform.dto;

public class ImageGenerationRequest {
    private String prompt;

    public ImageGenerationRequest() {
    }

    public ImageGenerationRequest(String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }
}

