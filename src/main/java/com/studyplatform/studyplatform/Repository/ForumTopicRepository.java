package com.studyplatform.studyplatform.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.studyplatform.studyplatform.Model.ForumTopic;
import com.studyplatform.studyplatform.Model.User;

@Repository
public interface ForumTopicRepository extends JpaRepository<ForumTopic, Long> {
    
    Page<ForumTopic> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    Page<ForumTopic> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    @Query("SELECT t FROM ForumTopic t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.content) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<ForumTopic> searchTopics(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT t FROM ForumTopic t WHERE :tag MEMBER OF t.tags")
    Page<ForumTopic> findByTag(@Param("tag") String tag, Pageable pageable);
    
    @Query("SELECT t FROM ForumTopic t ORDER BY SIZE(t.upvotedBy) - SIZE(t.downvotedBy) DESC")
    Page<ForumTopic> findTopRated(Pageable pageable);
    
    @Query("SELECT t FROM ForumTopic t ORDER BY t.viewCount DESC")
    Page<ForumTopic> findMostViewed(Pageable pageable);
    
    // Fix for the error - use JOIN to flatten the collection
    @Query("SELECT DISTINCT tag FROM ForumTopic t JOIN t.tags tag")
    List<String> findAllTags();
}