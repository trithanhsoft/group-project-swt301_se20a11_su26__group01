package com.rms.restaurant_management_system.dto.response;

import com.rms.restaurant_management_system.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;

    private String orderCode;

    private Long userId;

    private String username;

    private String email;

    private Long tableId;

    private String tableName;

    private String customerName;

    private String customerPhone;

    private OrderStatus status;

    private BigDecimal totalAmount;

    private String note;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<OrderItemResponse> items;
}