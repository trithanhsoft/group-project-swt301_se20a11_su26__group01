package com.rms.restaurant_management_system.dto.response;

import com.rms.restaurant_management_system.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecentOrderResponse {

    private Long orderId;
    private String orderCode;
    private String tableName;
    private Integer items;
    private BigDecimal totalAmount;
    private OrderStatus status;
}