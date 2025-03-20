package com.studyplatform.studyplatform.dto;

public class CommentRequest {
  
  private Long documentId;
  private String content;
  
  // Getters and Setters
  
  public Long getDocumentId() {
      return documentId;
  }
  
  public void setDocumentId(Long documentId) {
      this.documentId = documentId;
  }
  
  public String getContent() {
      return content;
  }
  
  public void setContent(String content) {
      this.content = content;
  }
}

