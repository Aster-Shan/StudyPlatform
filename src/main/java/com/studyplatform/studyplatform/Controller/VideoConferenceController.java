package com.studyplatform.studyplatform.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Service.UserService;
import com.studyplatform.studyplatform.dto.CreateRoomRequest;
import com.studyplatform.studyplatform.dto.JoinRoomRequest;
import com.studyplatform.studyplatform.dto.SignalingMessage;

@RestController
@RequestMapping("/api/video")
public class VideoConferenceController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private UserService userService;
    
    // Simple in-memory storage for active rooms
    private Map<String, Map<String, Object>> activeRooms = new HashMap<>();
    
    @PostMapping("/rooms")
    public ResponseEntity<?> createRoom(@RequestBody CreateRoomRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        String roomId = UUID.randomUUID().toString();
        
        Map<String, Object> roomInfo = new HashMap<>();
        roomInfo.put("name", request.getName());
        roomInfo.put("createdBy", user.getId());
        roomInfo.put("participants", new HashMap<String, User>());
        
        activeRooms.put(roomId, roomInfo);
        
        Map<String, Object> response = new HashMap<>();
        response.put("roomId", roomId);
        response.put("name", request.getName());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<?> getRoomInfo(@PathVariable String roomId) {
        if (!activeRooms.containsKey(roomId)) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(activeRooms.get(roomId));
    }
    
    @PostMapping("/rooms/{roomId}/join")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId, @RequestBody JoinRoomRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        if (!activeRooms.containsKey(roomId)) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> roomInfo = activeRooms.get(roomId);
        Map<String, User> participants = (Map<String, User>) roomInfo.get("participants");
        
        // Add user to participants
        participants.put(request.getPeerId(), user);
        
        // Notify other participants that a new user has joined
        messagingTemplate.convertAndSend("/topic/video/" + roomId + "/user-joined", user);
        
        return ResponseEntity.ok().build();
    }
    
    @MessageMapping("/video/{roomId}/signal")
    public void handleSignaling(@DestinationVariable String roomId, SignalingMessage message) {
        // Forward the signaling message to the target peer
        messagingTemplate.convertAndSend("/topic/video/" + roomId + "/signal/" + message.getTargetPeerId(), message);
    }
}

