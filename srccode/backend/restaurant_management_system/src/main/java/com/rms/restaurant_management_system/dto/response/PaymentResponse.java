package com.rms.restaurant_management_system.dto.response;

import com.rms.restaurant_management_system.enums.PaymentMethod;
import com.rms.restaurant_management_system.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PaymentResponse {

    private Long paymentId;

    private Long orderId;

    private String orderCode;

    private Long tableId;

    private String tableName;

    private String customerName;

    private PaymentMethod method;

    private PaymentStatus status;

    private BigDecimal amount;

    private Long payosOrderCode;

    private String paymentLinkId;

    private String checkoutUrl;

    private String qrCode;

    private String transactionCode;

    private String note;

    private LocalDateTime paidAt;

    private LocalDateTime createdAt;
}