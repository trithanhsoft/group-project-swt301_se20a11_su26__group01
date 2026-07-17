package com.rms.restaurant_management_system.service.impl;

import com.rms.restaurant_management_system.dto.request.FeedbackRequest;
import com.rms.restaurant_management_system.dto.request.UpdateFeedbackStatusRequest;
import com.rms.restaurant_management_system.dto.response.FeedbackResponse;
import com.rms.restaurant_management_system.entity.Feedback;
import com.rms.restaurant_management_system.entity.User;
import com.rms.restaurant_management_system.enums.FeedbackStatus;
import com.rms.restaurant_management_system.repository.FeedbackRepository;
import com.rms.restaurant_management_system.repository.UserRepository;
import com.rms.restaurant_management_system.service.interfaces.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    @Override
    public FeedbackResponse createFeedback(FeedbackRequest request) {
        User user = null;

        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElse(null);
        }

        String customerName = request.getCustomerName();
        String customerEmail = request.getCustomerEmail();

        if (user != null) {
            if (customerName == null || customerName.isBlank()) {
                customerName = user.getUsername();
            }

            if (customerEmail == null || customerEmail.isBlank()) {
                customerEmail = user.getEmail();
            }
        }

        Feedback feedback = Feedback.builder()
                .user(user)
                .customerName(customerName)
                .customerEmail(customerEmail)
                .customerPhone(request.getCustomerPhone())
                .tableId(request.getTableId())
                .tableName(request.getTableName())
                .orderCode(request.getOrderCode())
                .rating(request.getRating())
                .content(request.getContent())
                .status(FeedbackStatus.NEW)
                .build();

        return mapToResponse(feedbackRepository.save(feedback));
    }

    @Override
    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<FeedbackResponse> getFeedbacksByCustomer(Long userId) {
        return feedbackRepository.findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public FeedbackResponse updateFeedbackStatus(Long feedbackId, UpdateFeedbackStatusRequest request) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        if (request.getStatus() == null) {
            throw new RuntimeException("Status không được để trống");
        }

        feedback.setStatus(request.getStatus());

        return mapToResponse(feedbackRepository.save(feedback));
    }

    @Override
    public void deleteFeedback(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        feedbackRepository.delete(feedback);
    }

    private FeedbackResponse mapToResponse(Feedback feedback) {
        User user = feedback.getUser();

        return new FeedbackResponse(
                feedback.getFeedbackId(),
                user != null ? user.getUserId() : null,
                user != null ? user.getUsername() : null,
                feedback.getCustomerName(),
                feedback.getCustomerEmail(),
                feedback.getCustomerPhone(),
                feedback.getTableId(),
                feedback.getTableName(),
                feedback.getOrderCode(),
                feedback.getRating(),
                feedback.getContent(),
                feedback.getStatus(),
                feedback.getCreatedAt(),
                feedback.getUpdatedAt()
        );
    }
}