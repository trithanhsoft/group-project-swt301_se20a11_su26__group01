package com.rms.restaurant_management_system.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ReservationRequest {

    private Long userId;

    @NotNull(message = "Reservation date is required")
    private LocalDate reservationDate;

    @NotBlank(message = "Reservation time is required")
    private String reservationTime;

    @NotNull(message = "Number of guests is required")
    @Min(value = 1, message = "Number of guests must be at least 1")
    @Max(value = 20, message = "Number of guests must not exceed 20")
    private Integer numberOfGuests;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    private String customerEmail;

    private String note;

    @Valid
    private List<ReservationItemRequest> items;
}