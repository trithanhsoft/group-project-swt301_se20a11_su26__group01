package com.rms.restaurant_management_system.service.interfaces;

import com.rms.restaurant_management_system.dto.request.FeedbackRequest;
import com.rms.restaurant_management_system.dto.request.UpdateFeedbackStatusRequest;
import com.rms.restaurant_management_system.dto.response.FeedbackResponse;

import java.util.List;

public interface FeedbackService {

    FeedbackResponse createFeedback(FeedbackRequest request);

    List<FeedbackResponse> getAllFeedbacks();

    List<FeedbackResponse> getFeedbacksByCustomer(Long userId);

    FeedbackResponse updateFeedbackStatus(Long feedbackId, UpdateFeedbackStatusRequest request);

    void deleteFeedback(Long feedbackId);
}