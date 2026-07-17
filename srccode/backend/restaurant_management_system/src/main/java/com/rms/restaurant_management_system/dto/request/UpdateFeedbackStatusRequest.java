package com.rms.restaurant_management_system.dto.request;

import com.rms.restaurant_management_system.enums.FeedbackStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateFeedbackStatusRequest {

    private FeedbackStatus status;
}