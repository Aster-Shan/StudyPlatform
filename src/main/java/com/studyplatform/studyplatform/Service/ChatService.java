package com.studyplatform.studyplatform.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studyplatform.studyplatform.Model.ChatMessage;
import com.studyplatform.studyplatform.Model.ChatRoom;
import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Repository.ChatMessageRepository;
import com.studyplatform.studyplatform.Repository.ChatRoomRepository;
import com.studyplatform.studyplatform.dto.ChatMessageDTO;
import com.studyplatform.studyplatform.dto.ChatRoomDTO;

@Service
public class ChatService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private UserService userService;
    
    public List<ChatRoomDTO> getUserChatRooms(User user) {
        List<ChatRoom> chatRooms = chatRoomRepository.findByParticipantsContaining(user);
        
        return chatRooms.stream().map(room -> {
            ChatRoomDTO dto = convertToDTO(room);
            
            // Get unread message count
            long unreadCount = chatMessageRepository.countUnreadMessagesInRoom(room, user);
            dto.setUnreadCount(unreadCount);
            
            // Get latest message
            ChatMessage latestMessage = chatMessageRepository.findLatestMessageInRoom(room);
            if (latestMessage != null) {
                dto.setLatestMessage(convertToDTO(latestMessage));
            }
            
            return dto;
        }).collect(Collectors.toList());
    }
    
    public ChatRoomDTO getChatRoomById(Long id) {
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findById(id);
        if (chatRoomOpt.isPresent()) {
            ChatRoom chatRoom = chatRoomOpt.get();
            return convertToDTO(chatRoom);
        }
        throw new RuntimeException("Chat room not found with id: " + id);
    }
    
    @Transactional
    public ChatRoomDTO createGroupChat(String name, String description, User createdBy, Set<User> participants) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(name);
        chatRoom.setDescription(description);
        chatRoom.setGroupChat(true);
        chatRoom.setCreatedBy(createdBy);
        
        // Add creator to participants if not already included
        participants.add(createdBy);
        chatRoom.setParticipants(participants);
        
        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
        return convertToDTO(savedChatRoom);
    }
    
    @Transactional
    public ChatRoomDTO getOrCreatePrivateChat(User user1, User user2) {
        Optional<ChatRoom> existingChatRoom = chatRoomRepository.findPrivateChatBetweenUsers(user1, user2);
        
        if (existingChatRoom.isPresent()) {
            return convertToDTO(existingChatRoom.get());
        }
        
        // Create new private chat
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(user1.getFirstName() + " & " + user2.getFirstName());
        chatRoom.setGroupChat(false);
        chatRoom.setCreatedBy(user1);
        
        chatRoom.getParticipants().add(user1);
        chatRoom.getParticipants().add(user2);
        
        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
        return convertToDTO(savedChatRoom);
    }
    
    @Transactional
    public ChatMessageDTO sendMessage(Long chatRoomId, User sender, String content) {
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findById(chatRoomId);
        if (!chatRoomOpt.isPresent()) {
            throw new RuntimeException("Chat room not found with id: " + chatRoomId);
        }
        
        ChatRoom chatRoom = chatRoomOpt.get();
        
        // Verify sender is a participant
        if (!chatRoom.getParticipants().contains(sender)) {
            throw new RuntimeException("User is not a participant in this chat room");
        }
        
        ChatMessage message = new ChatMessage();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(content);
        
        ChatMessage savedMessage = chatMessageRepository.save(message);
        return convertToDTO(savedMessage);
    }
    
    public List<ChatMessageDTO> getChatMessages(Long chatRoomId, User user) {
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findById(chatRoomId);
        if (!chatRoomOpt.isPresent()) {
            throw new RuntimeException("Chat room not found with id: " + chatRoomId);
        }
        
        ChatRoom chatRoom = chatRoomOpt.get();
        
        // Verify user is a participant
        if (!chatRoom.getParticipants().contains(user)) {
            throw new RuntimeException("User is not a participant in this chat room");
        }
        
        List<ChatMessage> messages = chatMessageRepository.findByChatRoomOrderBySentAtAsc(chatRoom);
        
        // Mark messages as read
        messages.stream()
            .filter(msg -> !msg.getSender().equals(user) && !msg.isRead())
            .forEach(msg -> {
                msg.setRead(true);
                chatMessageRepository.save(msg);
            });
        
        return messages.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    // Helper methods to convert entities to DTOs
    
    private ChatRoomDTO convertToDTO(ChatRoom chatRoom) {
        ChatRoomDTO dto = new ChatRoomDTO();
        dto.setId(chatRoom.getId());
        dto.setName(chatRoom.getName());
        dto.setDescription(chatRoom.getDescription());
        dto.setGroupChat(chatRoom.isGroupChat());
        dto.setCreatedBy(chatRoom.getCreatedBy().getId());
        
        dto.setParticipants(chatRoom.getParticipants().stream()
            .map(User::getId)
            .collect(Collectors.toSet()));
        
        dto.setCreatedAt(chatRoom.getCreatedAt());
        dto.setUpdatedAt(chatRoom.getUpdatedAt());
        
        return dto;
    }
    
    private ChatMessageDTO convertToDTO(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setChatRoomId(message.getChatRoom().getId());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getFirstName() + " " + message.getSender().getLastName());
        dto.setContent(message.getContent());
        dto.setSentAt(message.getSentAt());
        dto.setRead(message.isRead());
        
        return dto;
    }
}

