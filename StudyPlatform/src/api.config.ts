// API Configuration
export const API_CONFIG = {
    // Base URL for API requests
    BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  
    // API Endpoints - Updated to match Spring Boot conventions
    ENDPOINTS: {
      // User endpoints
      USERS: "/api/users",
      USER_BY_ID: (id: string) => `/api/users/${id}`,
  
      // Chat endpoints - Updated to match your Spring Boot API
      CHAT_ROOMS: "/api/chat/rooms",
      CHAT_ROOM_BY_ID: (id: string) => `/api/chat/rooms/${id}`,
      CHAT_MESSAGES: (roomId: string) => `/api/chat/rooms/${roomId}/messages`,
      CHAT_SEND_MESSAGE: (roomId: string) => `/api/chat/rooms/${roomId}/messages`,
  
      // Updated endpoints for creating chats
      CHAT_CREATE: "/api/chat/rooms", // Use a single endpoint with different payloads
  
      // Authentication endpoints
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
      REFRESH_TOKEN: "/api/auth/refresh",
    },
  
    // Request timeout in milliseconds
    TIMEOUT: 15000,
  
    // HTTP Status codes
    STATUS: {
      OK: 200,
      CREATED: 201,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      SERVER_ERROR: 500,
    },
  }
  
  