package com.rms.restaurant_management_system.dto.request;

import com.rms.restaurant_management_system.enums.ReservationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateReservationStatusRequest {

    @NotNull(message = "Reservation status is required")
    private ReservationStatus status;
}