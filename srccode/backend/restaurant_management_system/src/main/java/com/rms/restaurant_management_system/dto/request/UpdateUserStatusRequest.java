package com.rms.restaurant_management_system.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserStatusRequest {

    private Boolean isActive;

    private Long currentUserId;
}