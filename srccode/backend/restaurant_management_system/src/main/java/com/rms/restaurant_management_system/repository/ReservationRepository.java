package com.rms.restaurant_management_system.repository;

import com.rms.restaurant_management_system.entity.Reservation;
import com.rms.restaurant_management_system.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByReservationCode(String reservationCode);

    List<Reservation> findAllByOrderByCreatedAtDesc();

    List<Reservation> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    List<Reservation> findByStatusOrderByCreatedAtDesc(ReservationStatus status);

    List<Reservation> findByReservationDateOrderByReservationTimeAsc(LocalDate reservationDate);
}