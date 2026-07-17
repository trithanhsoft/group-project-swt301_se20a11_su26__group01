package com.rms.restaurant_management_system.repository;

import com.rms.restaurant_management_system.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}