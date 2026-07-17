package com.rms.restaurant_management_system.repository;

import com.rms.restaurant_management_system.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderOrderId(Long orderId);

    Optional<Payment> findByPayosOrderCode(Long payosOrderCode);

    boolean existsByOrderOrderId(Long orderId);

    List<Payment> findAllByOrderByCreatedAtDesc();
}