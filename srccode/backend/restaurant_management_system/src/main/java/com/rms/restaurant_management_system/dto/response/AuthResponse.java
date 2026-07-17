package com.rms.restaurant_management_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {

    private Long userId;

    private String username;

    private String email;

    private String roleName;

    private String message;
}