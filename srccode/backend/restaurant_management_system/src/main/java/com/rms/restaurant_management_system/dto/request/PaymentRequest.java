package com.rms.restaurant_management_system.dto.request;

import com.rms.restaurant_management_system.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {

    @NotNull(message = "Payment method is required")
    private PaymentMethod method;

    private String transactionCode;

    private String note;
}