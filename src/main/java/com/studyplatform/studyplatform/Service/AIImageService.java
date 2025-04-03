package com.studyplatform.studyplatform.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class AIImageService {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.api.url}")
    private String openaiApiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    // Rate limiting
    private final Map<String, UserRateLimit> userRateLimits = new ConcurrentHashMap<>();
    private static final int RATE_LIMIT = 10; // requests per hour
    private static final long ONE_HOUR_MS = 60 * 60 * 1000;

    public AIImageService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String generateImage(String prompt) throws Exception {
        // Check rate limit
        String userId = getCurrentUserId();
        if (!checkRateLimit(userId)) {
            throw new Exception("Rate limit exceeded. Please try again later.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "dall-e-3");
        requestBody.put("prompt", prompt);
        requestBody.put("n", 1);
        requestBody.put("size", "1024x1024");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        String response = restTemplate.postForObject(openaiApiUrl + "/images/generations", request, String.class);
        JsonNode jsonResponse = objectMapper.readTree(response);

        if (jsonResponse.has("data") && jsonResponse.get("data").isArray() && jsonResponse.get("data").size() > 0) {
            return jsonResponse.get("data").get(0).get("url").asText();
        } else {
            throw new Exception("Failed to generate image: Invalid response from OpenAI");
        }
    }

    private String getCurrentUserId() {
        // In a real application, get this from your authentication system
        return "user-123";
    }

    private boolean checkRateLimit(String userId) {
        long now = System.currentTimeMillis();
        
        UserRateLimit rateLimit = userRateLimits.computeIfAbsent(userId, 
            k -> new UserRateLimit(new AtomicInteger(0), now + ONE_HOUR_MS));
        
        if (now > rateLimit.getResetTime()) {
            rateLimit.setCount(new AtomicInteger(1));
            rateLimit.setResetTime(now + ONE_HOUR_MS);
            return true;
        }
        
        return rateLimit.getCount().incrementAndGet() <= RATE_LIMIT;
    }

    private static class UserRateLimit {
        private AtomicInteger count;
        private long resetTime;

        public UserRateLimit(AtomicInteger count, long resetTime) {
            this.count = count;
            this.resetTime = resetTime;
        }

        public AtomicInteger getCount() {
            return count;
        }

        public void setCount(AtomicInteger count) {
            this.count = count;
        }

        public long getResetTime() {
            return resetTime;
        }

        public void setResetTime(long resetTime) {
            this.resetTime = resetTime;
        }
    }
}

