package com.studyplatform.studyplatform.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.studyplatform.studyplatform.Model.ForumReply;
import com.studyplatform.studyplatform.Model.ForumTopic;
import com.studyplatform.studyplatform.Model.User;

@Repository
public interface ForumReplyRepository extends JpaRepository<ForumReply, Long> {
    
    List<ForumReply> findByTopicOrderByCreatedAtAsc(ForumTopic topic);
    
    List<ForumReply> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT COUNT(r) FROM ForumReply r WHERE r.topic = :topic")
    long countRepliesByTopic(@Param("topic") ForumTopic topic);
    
    Optional<ForumReply> findByTopicAndIsAcceptedAnswerTrue(ForumTopic topic);
}

