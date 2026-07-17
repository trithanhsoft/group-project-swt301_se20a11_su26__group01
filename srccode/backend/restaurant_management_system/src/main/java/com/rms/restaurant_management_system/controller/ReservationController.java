package com.rms.restaurant_management_system.controller;

import com.rms.restaurant_management_system.dto.request.ReservationRequest;
import com.rms.restaurant_management_system.dto.request.UpdateReservationStatusRequest;
import com.rms.restaurant_management_system.dto.response.ReservationResponse;
import com.rms.restaurant_management_system.service.interfaces.ReservationService;
import com.rms.restaurant_management_system.dto.request.CheckInReservationRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ReservationResponse createReservation(@Valid @RequestBody ReservationRequest request) {
        return reservationService.createReservation(request);
    }

    @GetMapping
    public List<ReservationResponse> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{reservationId}")
    public ReservationResponse getReservationById(@PathVariable Long reservationId) {
        return reservationService.getReservationById(reservationId);
    }

    @GetMapping("/customer/{userId}")
    public List<ReservationResponse> getReservationsByCustomer(@PathVariable Long userId) {
        return reservationService.getReservationsByCustomer(userId);
    }

    @GetMapping("/status/{status}")
    public List<ReservationResponse> getReservationsByStatus(@PathVariable String status) {
        return reservationService.getReservationsByStatus(status);
    }

    @PutMapping("/{reservationId}/status")
    public ReservationResponse updateReservationStatus(
            @PathVariable Long reservationId,
            @Valid @RequestBody UpdateReservationStatusRequest request
    ) {
        return reservationService.updateReservationStatus(reservationId, request);
    }

    @DeleteMapping("/{reservationId}")
    public String cancelReservation(@PathVariable Long reservationId) {
        reservationService.cancelReservation(reservationId);
        return "Reservation cancelled successfully";
    }
    @PutMapping("/{reservationId}/check-in")
public ReservationResponse checkInReservation(
        @PathVariable Long reservationId,
        @Valid @RequestBody CheckInReservationRequest request
) {
    return reservationService.checkInReservation(reservationId, request);
}
}