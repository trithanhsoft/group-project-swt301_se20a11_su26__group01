package com.rms.restaurant_management_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class UserResponse {

    private Long userId;

    private String username;

    private String email;

    private String roleName;

    private Boolean isActive;

    private LocalDateTime createdAt;
}