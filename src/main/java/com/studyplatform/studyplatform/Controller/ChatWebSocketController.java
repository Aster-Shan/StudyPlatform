package com.studyplatform.studyplatform.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Service.ChatService;
import com.studyplatform.studyplatform.Service.UserService;
import com.studyplatform.studyplatform.dto.ChatMessageDTO;
import com.studyplatform.studyplatform.dto.SendMessageRequest;

@Controller
public class ChatWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private UserService userService;
    
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(
            @DestinationVariable Long roomId,
            @Payload SendMessageRequest messageRequest,
            Authentication authentication) {
        
        String email = authentication.getName();
        User sender = userService.getUserByEmail(email);
        
        ChatMessageDTO message = chatService.sendMessage(roomId, sender, messageRequest.getContent());
        
        // Broadcast the message to all subscribers of this chat room
        messagingTemplate.convertAndSend("/topic/chat/" + roomId, message);
    }
}

