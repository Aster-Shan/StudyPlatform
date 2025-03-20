package com.studyplatform.studyplatform.Controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Service.ChatService;
import com.studyplatform.studyplatform.Service.UserService;
import com.studyplatform.studyplatform.dto.ChatMessageDTO;
import com.studyplatform.studyplatform.dto.ChatRoomDTO;
import com.studyplatform.studyplatform.dto.CreateGroupChatRequest;
import com.studyplatform.studyplatform.dto.SendMessageRequest;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getUserChatRooms() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        List<ChatRoomDTO> chatRooms = chatService.getUserChatRooms(user);
        return ResponseEntity.ok(chatRooms);
    }
    
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ChatRoomDTO> getChatRoomById(@PathVariable Long roomId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        // The service will verify if the user is a participant
        ChatRoomDTO chatRoom = chatService.getChatRoomById(roomId);
        return ResponseEntity.ok(chatRoom);
    }
    
    @PostMapping("/rooms/group")
    public ResponseEntity<ChatRoomDTO> createGroupChat(@RequestBody CreateGroupChatRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User currentUser = userService.getUserByEmail(email);
        
        Set<User> participants = new HashSet<>();
        for (Long userId : request.getParticipantIds()) {
            User user = userService.getUserById(userId);
            participants.add(user);
        }
        
        ChatRoomDTO chatRoom = chatService.createGroupChat(
            request.getName(), 
            request.getDescription(), 
            currentUser, 
            participants
        );
        
        return ResponseEntity.ok(chatRoom);
    }
    
    @PostMapping("/rooms/private/{userId}")
    public ResponseEntity<ChatRoomDTO> getOrCreatePrivateChat(@PathVariable Long userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User currentUser = userService.getUserByEmail(email);
        
        User otherUser = userService.getUserById(userId);
        
        ChatRoomDTO chatRoom = chatService.getOrCreatePrivateChat(currentUser, otherUser);
        return ResponseEntity.ok(chatRoom);
    }
    
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getChatMessages(@PathVariable Long roomId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        List<ChatMessageDTO> messages = chatService.getChatMessages(roomId, user);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping("/rooms/{roomId}/messages")
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @PathVariable Long roomId, 
            @RequestBody SendMessageRequest request) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User sender = userService.getUserByEmail(email);
        
        ChatMessageDTO message = chatService.sendMessage(roomId, sender, request.getContent());
        return ResponseEntity.ok(message);
    }
}

