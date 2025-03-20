package com.studyplatform.studyplatform.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Service.ForumService;
import com.studyplatform.studyplatform.Service.UserService;
import com.studyplatform.studyplatform.dto.CreateTopicRequest;
import com.studyplatform.studyplatform.dto.ForumReplyDTO;
import com.studyplatform.studyplatform.dto.ForumTopicDTO;
import com.studyplatform.studyplatform.dto.PagedResponseDTO;
import com.studyplatform.studyplatform.dto.ReplyRequest;
import com.studyplatform.studyplatform.dto.UpdateTopicRequest;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    @Autowired
    private ForumService forumService;
    
    @Autowired
    private UserService userService;
    
    // Topic endpoints
    
    @GetMapping("/topics")
    public ResponseEntity<PagedResponseDTO<ForumTopicDTO>> getAllTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponseDTO<ForumTopicDTO> topics = forumService.getAllTopics(page, size);
        return ResponseEntity.ok(topics);
    }
    
    @GetMapping("/topics/user/{userId}")
    public ResponseEntity<PagedResponseDTO<ForumTopicDTO>> getTopicsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        User user = userService.getUserById(userId);
        PagedResponseDTO<ForumTopicDTO> topics = forumService.getTopicsByUser(user, page, size);
        return ResponseEntity.ok(topics);
    }
    
    @GetMapping("/topics/search")
    public ResponseEntity<PagedResponseDTO<ForumTopicDTO>> searchTopics(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponseDTO<ForumTopicDTO> topics = forumService.searchTopics(query, page, size);
        return ResponseEntity.ok(topics);
    }
    
    @GetMapping("/topics/tag/{tag}")
    public ResponseEntity<PagedResponseDTO<ForumTopicDTO>> getTopicsByTag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponseDTO<ForumTopicDTO> topics = forumService.getTopicsByTag(tag, page, size);
        return ResponseEntity.ok(topics);
    }
    
    @GetMapping("/topics/top-rated")
    public ResponseEntity<PagedResponseDTO<ForumTopicDTO>> getTopRatedTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponseDTO<ForumTopicDTO> topics = forumService.getTopRatedTopics(page, size);
        return ResponseEntity.ok(topics);
    }
    
    @GetMapping("/topics/most-viewed")
    public ResponseEntity<PagedResponseDTO<ForumTopicDTO>> getMostViewedTopics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PagedResponseDTO<ForumTopicDTO> topics = forumService.getMostViewedTopics(page, size);
        return ResponseEntity.ok(topics);
    }
    
    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags() {
        List<String> tags = forumService.getAllTags();
        return ResponseEntity.ok(tags);
    }
    
    @GetMapping("/topics/{id}")
    public ResponseEntity<ForumTopicDTO> getTopicById(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumTopicDTO topic = forumService.getTopicById(id, user);
        return ResponseEntity.ok(topic);
    }
    
    @PostMapping("/topics")
    public ResponseEntity<ForumTopicDTO> createTopic(@RequestBody CreateTopicRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumTopicDTO topic = forumService.createTopic(
            request.getTitle(),
            request.getContent(),
            request.getTags(),
            user
        );
        
        return ResponseEntity.ok(topic);
    }
    
    @PutMapping("/topics/{id}")
    public ResponseEntity<ForumTopicDTO> updateTopic(
            @PathVariable Long id,
            @RequestBody UpdateTopicRequest request) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumTopicDTO topic = forumService.updateTopic(
            id,
            request.getTitle(),
            request.getContent(),
            request.getTags(),
            user
        );
        
        return ResponseEntity.ok(topic);
    }
    
    @DeleteMapping("/topics/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        forumService.deleteTopic(id, user);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/topics/{id}/upvote")
    public ResponseEntity<ForumTopicDTO> upvoteTopic(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumTopicDTO topic = forumService.voteTopic(id, user, true);
        return ResponseEntity.ok(topic);
    }
    
    @PostMapping("/topics/{id}/downvote")
    public ResponseEntity<ForumTopicDTO> downvoteTopic(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumTopicDTO topic = forumService.voteTopic(id, user, false);
        return ResponseEntity.ok(topic);
    }
    
    @DeleteMapping("/topics/{id}/upvote")
    public ResponseEntity<ForumTopicDTO> removeUpvoteTopic(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumTopicDTO topic = forumService.removeVoteTopic(id, user, true);
        return ResponseEntity.ok(topic);
    }
    
    @DeleteMapping("/topics/{id}/downvote")
    public ResponseEntity<ForumTopicDTO> removeDownvoteTopic(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumTopicDTO topic = forumService.removeVoteTopic(id, user, false);
        return ResponseEntity.ok(topic);
    }
    
    // Reply endpoints
    
    @GetMapping("/topics/{topicId}/replies")
    public ResponseEntity<List<ForumReplyDTO>> getRepliesByTopic(@PathVariable Long topicId) {
        List<ForumReplyDTO> replies = forumService.getRepliesByTopic(topicId);
        return ResponseEntity.ok(replies);
    }
    
    @PostMapping("/topics/{topicId}/replies")
    public ResponseEntity<ForumReplyDTO> createReply(
            @PathVariable Long topicId,
            @RequestBody ReplyRequest request) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumReplyDTO reply = forumService.createReply(topicId, request.getContent(), user);
        return ResponseEntity.ok(reply);
    }
    
    @PutMapping("/replies/{id}")
    public ResponseEntity<ForumReplyDTO> updateReply(
            @PathVariable Long id,
            @RequestBody ReplyRequest request) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumReplyDTO reply = forumService.updateReply(id, request.getContent(), user);
        return ResponseEntity.ok(reply);
    }
    
    @DeleteMapping("/replies/{id}")
    public ResponseEntity<?> deleteReply(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        forumService.deleteReply(id, user);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/replies/{id}/accept")
    public ResponseEntity<ForumReplyDTO> markAsAcceptedAnswer(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumReplyDTO reply = forumService.markAsAcceptedAnswer(id, user);
        return ResponseEntity.ok(reply);
    }
    
    @PostMapping("/replies/{id}/upvote")
    public ResponseEntity<ForumReplyDTO> upvoteReply(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumReplyDTO reply = forumService.voteReply(id, user, true);
        return ResponseEntity.ok(reply);
    }
    
    @PostMapping("/replies/{id}/downvote")
    public ResponseEntity<ForumReplyDTO> downvoteReply(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumReplyDTO reply = forumService.voteReply(id, user, false);
        return ResponseEntity.ok(reply);
    }
    
    @DeleteMapping("/replies/{id}/upvote")
    public ResponseEntity<ForumReplyDTO> removeUpvoteReply(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumReplyDTO reply = forumService.removeVoteReply(id, user, true);
        return ResponseEntity.ok(reply);
    }
    
    @DeleteMapping("/replies/{id}/downvote")
    public ResponseEntity<ForumReplyDTO> removeDownvoteReply(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userService.getUserByEmail(email);
        
        ForumReplyDTO reply = forumService.removeVoteReply(id, user, false);
        return ResponseEntity.ok(reply);
    }
}

