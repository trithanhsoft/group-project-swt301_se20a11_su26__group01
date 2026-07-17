package com.rms.restaurant_management_system.repository;

import com.rms.restaurant_management_system.entity.Feedback;
import com.rms.restaurant_management_system.enums.FeedbackStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    List<Feedback> findByStatusOrderByCreatedAtDesc(FeedbackStatus status);

    List<Feedback> findAllByOrderByCreatedAtDesc();
}