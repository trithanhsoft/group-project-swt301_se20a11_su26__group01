package com.rms.restaurant_management_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class OrderItemResponse {

    private Long orderItemId;

    private Long foodId;

    private String foodName;

    private BigDecimal unitPrice;

    private Integer quantity;

    private BigDecimal subtotal;

    private String imageUrl;

    private String emoji;
}