package com.studyplatform.studyplatform.dto;

public class ImageGenerationResponse {
    private String imageUrl;
    private String error;

    public ImageGenerationResponse() {
    }

    public ImageGenerationResponse(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public ImageGenerationResponse(String imageUrl, String error) {
        this.imageUrl = imageUrl;
        this.error = error;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}

