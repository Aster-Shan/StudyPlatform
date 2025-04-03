package com.studyplatform.studyplatform.dto;

public class TextExtractionResponse {
    private String text;
    private String error;

    public TextExtractionResponse() {
    }

    public TextExtractionResponse(String text) {
        this.text = text;
    }

    public TextExtractionResponse(String text, String error) {
        this.text = text;
        this.error = error;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}

