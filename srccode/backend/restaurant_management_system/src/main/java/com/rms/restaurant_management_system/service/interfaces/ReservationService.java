package com.rms.restaurant_management_system.service.interfaces;

import com.rms.restaurant_management_system.dto.request.ReservationRequest;
import com.rms.restaurant_management_system.dto.request.UpdateReservationStatusRequest;
import com.rms.restaurant_management_system.dto.response.ReservationResponse;
import com.rms.restaurant_management_system.dto.request.CheckInReservationRequest;

import java.util.List;

public interface ReservationService {

    ReservationResponse createReservation(ReservationRequest request);

    List<ReservationResponse> getAllReservations();

    ReservationResponse getReservationById(Long reservationId);

    List<ReservationResponse> getReservationsByCustomer(Long userId);

    List<ReservationResponse> getReservationsByStatus(String status);

    ReservationResponse updateReservationStatus(Long reservationId, UpdateReservationStatusRequest request);
    
    ReservationResponse checkInReservation(Long reservationId, CheckInReservationRequest request);
    
    void cancelReservation(Long reservationId);
}