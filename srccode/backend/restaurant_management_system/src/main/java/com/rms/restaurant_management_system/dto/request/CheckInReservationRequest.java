package com.rms.restaurant_management_system.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckInReservationRequest {

    @NotBlank(message = "Assigned table is required")
    private String assignedTable;
}