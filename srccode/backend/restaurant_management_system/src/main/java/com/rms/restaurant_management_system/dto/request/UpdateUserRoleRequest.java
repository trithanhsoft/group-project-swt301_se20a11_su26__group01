package com.rms.restaurant_management_system.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRoleRequest {

    private String roleName;

    private Long currentUserId;
}