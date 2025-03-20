package com.studyplatform.studyplatform.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studyplatform.studyplatform.Model.ForumReply;
import com.studyplatform.studyplatform.Model.ForumTopic;
import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Repository.ForumReplyRepository;
import com.studyplatform.studyplatform.Repository.ForumTopicRepository;
import com.studyplatform.studyplatform.dto.ForumReplyDTO;
import com.studyplatform.studyplatform.dto.ForumTopicDTO;
import com.studyplatform.studyplatform.dto.PagedResponseDTO;

@Service
public class ForumService {

    @Autowired
    private ForumTopicRepository topicRepository;
    
    @Autowired
    private ForumReplyRepository replyRepository;
    
    // Topic methods
    
    public PagedResponseDTO<ForumTopicDTO> getAllTopics(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumTopic> topicsPage = topicRepository.findAllByOrderByCreatedAtDesc(pageable);
        
        List<ForumTopicDTO> topics = topicsPage.getContent().stream()
            .map(this::convertToTopicDTO)
            .collect(Collectors.toList());
        
        return new PagedResponseDTO<>(
            topics,
            topicsPage.getNumber(),
            topicsPage.getSize(),
            topicsPage.getTotalElements(),
            topicsPage.getTotalPages()
        );
    }
    
    public PagedResponseDTO<ForumTopicDTO> getTopicsByUser(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumTopic> topicsPage = topicRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        
        List<ForumTopicDTO> topics = topicsPage.getContent().stream()
            .map(this::convertToTopicDTO)
            .collect(Collectors.toList());
        
        return new PagedResponseDTO<>(
            topics,
            topicsPage.getNumber(),
            topicsPage.getSize(),
            topicsPage.getTotalElements(),
            topicsPage.getTotalPages()
        );
    }
    
    public PagedResponseDTO<ForumTopicDTO> searchTopics(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumTopic> topicsPage = topicRepository.searchTopics(query, pageable);
        
        List<ForumTopicDTO> topics = topicsPage.getContent().stream()
            .map(this::convertToTopicDTO)
            .collect(Collectors.toList());
        
        return new PagedResponseDTO<>(
            topics,
            topicsPage.getNumber(),
            topicsPage.getSize(),
            topicsPage.getTotalElements(),
            topicsPage.getTotalPages()
        );
    }
    
    public PagedResponseDTO<ForumTopicDTO> getTopicsByTag(String tag, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumTopic> topicsPage = topicRepository.findByTag(tag, pageable);
        
        List<ForumTopicDTO> topics = topicsPage.getContent().stream()
            .map(this::convertToTopicDTO)
            .collect(Collectors.toList());
        
        return new PagedResponseDTO<>(
            topics,
            topicsPage.getNumber(),
            topicsPage.getSize(),
            topicsPage.getTotalElements(),
            topicsPage.getTotalPages()
        );
    }
    
    public PagedResponseDTO<ForumTopicDTO> getTopRatedTopics(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumTopic> topicsPage = topicRepository.findTopRated(pageable);
        
        List<ForumTopicDTO> topics = topicsPage.getContent().stream()
            .map(this::convertToTopicDTO)
            .collect(Collectors.toList());
        
        return new PagedResponseDTO<>(
            topics,
            topicsPage.getNumber(),
            topicsPage.getSize(),
            topicsPage.getTotalElements(),
            topicsPage.getTotalPages()
        );
    }
    
    public PagedResponseDTO<ForumTopicDTO> getMostViewedTopics(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ForumTopic> topicsPage = topicRepository.findMostViewed(pageable);
        
        List<ForumTopicDTO> topics = topicsPage.getContent().stream()
            .map(this::convertToTopicDTO)
            .collect(Collectors.toList());
        
        return new PagedResponseDTO<>(
            topics,
            topicsPage.getNumber(),
            topicsPage.getSize(),
            topicsPage.getTotalElements(),
            topicsPage.getTotalPages()
        );
    }
    
    public List<String> getAllTags() {
        return topicRepository.findAllTags();
    }
    
    @Transactional
    public ForumTopicDTO getTopicById(Long id, User currentUser) {
        Optional<ForumTopic> topicOpt = topicRepository.findById(id);
        if (!topicOpt.isPresent()) {
            throw new RuntimeException("Topic not found with id: " + id);
        }
        
        ForumTopic topic = topicOpt.get();
        
        // Increment view count
        topic.incrementViewCount();
        topicRepository.save(topic);
        
        return convertToTopicDTO(topic);
    }
    
    @Transactional
    public ForumTopicDTO createTopic(String title, String content, List<String> tags, User user) {
        ForumTopic topic = new ForumTopic();
        topic.setTitle(title);
        topic.setContent(content);
        topic.setUser(user);
        
        if (tags != null) {
            tags.forEach(topic::addTag);
        }
        
        ForumTopic savedTopic = topicRepository.save(topic);
        return convertToTopicDTO(savedTopic);
    }
    
    @Transactional
    public ForumTopicDTO updateTopic(Long id, String title, String content, List<String> tags, User user) {
        Optional<ForumTopic> topicOpt = topicRepository.findById(id);
        if (!topicOpt.isPresent()) {
            throw new RuntimeException("Topic not found with id: " + id);
        }
        
        ForumTopic topic = topicOpt.get();
        
        // Check if user is the author
        if (!topic.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to update this topic");
        }
        
        topic.setTitle(title);
        topic.setContent(content);
        
        // Update tags
        topic.getTags().clear();
        if (tags != null) {
            tags.forEach(topic::addTag);
        }
        
        ForumTopic updatedTopic = topicRepository.save(topic);
        return convertToTopicDTO(updatedTopic);
    }
    
    @Transactional
    public void deleteTopic(Long id, User user) {
        Optional<ForumTopic> topicOpt = topicRepository.findById(id);
        if (!topicOpt.isPresent()) {
            throw new RuntimeException("Topic not found with id: " + id);
        }
        
        ForumTopic topic = topicOpt.get();
        
        // Check if user is the author
        if (!topic.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this topic");
        }
        
        // Delete all replies first
        List<ForumReply> replies = replyRepository.findByTopicOrderByCreatedAtAsc(topic);
        replyRepository.deleteAll(replies);
        
        // Delete the topic
        topicRepository.delete(topic);
    }
    
    @Transactional
    public ForumTopicDTO voteTopic(Long id, User user, boolean isUpvote) {
        Optional<ForumTopic> topicOpt = topicRepository.findById(id);
        if (!topicOpt.isPresent()) {
            throw new RuntimeException("Topic not found with id: " + id);
        }
        
        ForumTopic topic = topicOpt.get();
        
        if (isUpvote) {
            topic.addUpvote(user.getId());
        } else {
            topic.addDownvote(user.getId());
        }
        
        ForumTopic updatedTopic = topicRepository.save(topic);
        return convertToTopicDTO(updatedTopic);
    }
    
    @Transactional
    public ForumTopicDTO removeVoteTopic(Long id, User user, boolean isUpvote) {
        Optional<ForumTopic> topicOpt = topicRepository.findById(id);
        if (!topicOpt.isPresent()) {
            throw new RuntimeException("Topic not found with id: " + id);
        }
        
        ForumTopic topic = topicOpt.get();
        
        if (isUpvote) {
            topic.removeUpvote(user.getId());
        } else {
            topic.removeDownvote(user.getId());
        }
        
        ForumTopic updatedTopic = topicRepository.save(topic);
        return convertToTopicDTO(updatedTopic);
    }
    
    // Reply methods
    
    public List<ForumReplyDTO> getRepliesByTopic(Long topicId) {
        Optional<ForumTopic> topicOpt = topicRepository.findById(topicId);
        if (!topicOpt.isPresent()) {
            throw new RuntimeException("Topic not found with id: " + topicId);
        }
        
        ForumTopic topic = topicOpt.get();
        List<ForumReply> replies = replyRepository.findByTopicOrderByCreatedAtAsc(topic);
        
        return replies.stream()
            .map(this::convertToReplyDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public ForumReplyDTO createReply(Long topicId, String content, User user) {
        Optional<ForumTopic> topicOpt = topicRepository.findById(topicId);
        if (!topicOpt.isPresent()) {
            throw new RuntimeException("Topic not found with id: " + topicId);
        }
        
        ForumTopic topic = topicOpt.get();
        
        ForumReply reply = new ForumReply();
        reply.setContent(content);
        reply.setTopic(topic);
        reply.setUser(user);
        
        ForumReply savedReply = replyRepository.save(reply);
        return convertToReplyDTO(savedReply);
    }
    
    @Transactional
    public ForumReplyDTO updateReply(Long replyId, String content, User user) {
        Optional<ForumReply> replyOpt = replyRepository.findById(replyId);
        if (!replyOpt.isPresent()) {
            throw new RuntimeException("Reply not found with id: " + replyId);
        }
        
        ForumReply reply = replyOpt.get();
        
        // Check if user is the author
        if (!reply.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to update this reply");
        }
        
        reply.setContent(content);
        
        ForumReply updatedReply = replyRepository.save(reply);
        return convertToReplyDTO(updatedReply);
    }
    
    @Transactional
    public void deleteReply(Long replyId, User user) {
        Optional<ForumReply> replyOpt = replyRepository.findById(replyId);
        if (!replyOpt.isPresent()) {
            throw new RuntimeException("Reply not found with id: " + replyId);
        }
        
        ForumReply reply = replyOpt.get();
        
        // Check if user is the author
        if (!reply.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this reply");
        }
        
        replyRepository.delete(reply);
    }
    
    @Transactional
    public ForumReplyDTO markAsAcceptedAnswer(Long replyId, User user) {
        Optional<ForumReply> replyOpt = replyRepository.findById(replyId);
        if (!replyOpt.isPresent()) {
            throw new RuntimeException("Reply not found with id: " + replyId);
        }
        
        ForumReply reply = replyOpt.get();
        ForumTopic topic = reply.getTopic();
        
        // Check if user is the topic author
        if (!topic.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Only the topic author can mark an answer as accepted");
        }
        
        // Unmark any previously accepted answer
        Optional<ForumReply> previousAcceptedReply = replyRepository.findByTopicAndIsAcceptedAnswerTrue(topic);
        if (previousAcceptedReply.isPresent()) {
            ForumReply prevReply = previousAcceptedReply.get();
            prevReply.setAcceptedAnswer(false);
            replyRepository.save(prevReply);
        }
        
        // Mark the new accepted answer
        reply.setAcceptedAnswer(true);
        ForumReply updatedReply = replyRepository.save(reply);
        
        return convertToReplyDTO(updatedReply);
    }
    
    @Transactional
    public ForumReplyDTO voteReply(Long replyId, User user, boolean isUpvote) {
        Optional<ForumReply> replyOpt = replyRepository.findById(replyId);
        if (!replyOpt.isPresent()) {
            throw new RuntimeException("Reply not found with id: " + replyId);
        }
        
        ForumReply reply = replyOpt.get();
        
        if (isUpvote) {
            reply.addUpvote(user.getId());
        } else {
            reply.addDownvote(user.getId());
        }
        
        ForumReply updatedReply = replyRepository.save(reply);
        return convertToReplyDTO(updatedReply);
    }
    
    @Transactional
    public ForumReplyDTO removeVoteReply(Long replyId, User user, boolean isUpvote) {
        Optional<ForumReply> replyOpt = replyRepository.findById(replyId);
        if (!replyOpt.isPresent()) {
            throw new RuntimeException("Reply not found with id: " + replyId);
        }
        
        ForumReply reply = replyOpt.get();
        
        if (isUpvote) {
            reply.removeUpvote(user.getId());
        } else {
            reply.removeDownvote(user.getId());
        }
        
        ForumReply updatedReply = replyRepository.save(reply);
        return convertToReplyDTO(updatedReply);
    }
    
    // Helper methods to convert entities to DTOs
    
    private ForumTopicDTO convertToTopicDTO(ForumTopic topic) {
        ForumTopicDTO dto = new ForumTopicDTO();
        dto.setId(topic.getId());
        dto.setTitle(topic.getTitle());
        dto.setContent(topic.getContent());
        dto.setUser(topic.getUser());
        dto.setCreatedAt(topic.getCreatedAt());
        dto.setUpdatedAt(topic.getUpdatedAt());
        dto.setViewCount(topic.getViewCount());
        
        // Get reply count
        long replyCount = replyRepository.countRepliesByTopic(topic);
        dto.setReplyCount((int) replyCount);
        
        dto.setUpvotes(topic.getUpvotes());
        dto.setDownvotes(topic.getDownvotes());
        dto.setTags(topic.getTags());
        
        return dto;
    }
    
    private ForumReplyDTO convertToReplyDTO(ForumReply reply) {
        ForumReplyDTO dto = new ForumReplyDTO();
        dto.setId(reply.getId());
        dto.setContent(reply.getContent());
        dto.setTopicId(reply.getTopic().getId());
        dto.setUser(reply.getUser());
        dto.setCreatedAt(reply.getCreatedAt());
        dto.setUpdatedAt(reply.getUpdatedAt());
        dto.setUpvotes(reply.getUpvotes());
        dto.setDownvotes(reply.getDownvotes());
        dto.setAcceptedAnswer(reply.isAcceptedAnswer());
        
        return dto;
    }
}

