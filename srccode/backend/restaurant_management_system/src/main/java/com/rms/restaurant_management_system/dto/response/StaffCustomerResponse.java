package com.rms.restaurant_management_system.dto.response;

import com.rms.restaurant_management_system.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class StaffCustomerResponse {

    private Long userId;

    private String username;

    private String email;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private Long totalOrders;

    private Long activeOrders;

    private Long completedOrders;

    private Long cancelledOrders;

    private BigDecimal totalSpent;

    private LocalDateTime lastOrderAt;

    private String lastOrderCode;

    private OrderStatus lastOrderStatus;

    private String lastCustomerPhone;
}