package com.studyplatform.studyplatform.Repository;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.studyplatform.studyplatform.Model.User;
import com.studyplatform.studyplatform.Model.VerificationToken;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUser(User user);
     @Transactional
    @Modifying
    @Query("DELETE FROM VerificationToken t WHERE t.user = :user")
    void deleteByUser(User user);
}