package com.rms.restaurant_management_system.dto.request;

import com.rms.restaurant_management_system.enums.TableStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTableStatusRequest {

    @NotNull(message = "Table status is required")
    private TableStatus status;

    private String currentOrderCode;

    private String reservedBy;
}