package com.rms.restaurant_management_system.dto.response;

import com.rms.restaurant_management_system.enums.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ReservationResponse {

    private Long reservationId;

    private String reservationCode;

    private Long userId;

    private String username;

    private String customerName;

    private String customerPhone;

    private String customerEmail;

    private LocalDate reservationDate;

    private String reservationTime;

    private Integer numberOfGuests;

    private ReservationStatus status;

    private String note;

    private String assignedTable;

    private BigDecimal preOrderTotal;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<ReservationItemResponse> items;
}