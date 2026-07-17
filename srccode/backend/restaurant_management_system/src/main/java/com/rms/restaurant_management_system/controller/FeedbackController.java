package com.rms.restaurant_management_system.controller;

import com.rms.restaurant_management_system.dto.request.FeedbackRequest;
import com.rms.restaurant_management_system.dto.request.UpdateFeedbackStatusRequest;
import com.rms.restaurant_management_system.dto.response.FeedbackResponse;
import com.rms.restaurant_management_system.service.interfaces.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public FeedbackResponse createFeedback(@Valid @RequestBody FeedbackRequest request) {
        return feedbackService.createFeedback(request);
    }

    @GetMapping
    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/customer/{userId}")
    public List<FeedbackResponse> getFeedbacksByCustomer(@PathVariable Long userId) {
        return feedbackService.getFeedbacksByCustomer(userId);
    }

    @PutMapping("/{feedbackId}/status")
    public FeedbackResponse updateFeedbackStatus(
            @PathVariable Long feedbackId,
            @RequestBody UpdateFeedbackStatusRequest request
    ) {
        return feedbackService.updateFeedbackStatus(feedbackId, request);
    }

    @DeleteMapping("/{feedbackId}")
    public void deleteFeedback(@PathVariable Long feedbackId) {
        feedbackService.deleteFeedback(feedbackId);
    }
}