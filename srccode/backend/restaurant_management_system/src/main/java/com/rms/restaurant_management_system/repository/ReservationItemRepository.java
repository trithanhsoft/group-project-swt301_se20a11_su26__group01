package com.rms.restaurant_management_system.repository;

import com.rms.restaurant_management_system.entity.ReservationItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationItemRepository extends JpaRepository<ReservationItem, Long> {
}