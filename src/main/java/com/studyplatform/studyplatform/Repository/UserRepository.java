package com.studyplatform.studyplatform.Repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studyplatform.studyplatform.Model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    // This method is now explicitly defined
    Optional<User> findByVerificationToken(String token);
    Optional<User> findByResetToken(String resetToken);

}
