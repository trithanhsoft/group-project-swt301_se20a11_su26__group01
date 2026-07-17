package com.rms.restaurant_management_system.service.interfaces;

import com.rms.restaurant_management_system.dto.request.PaymentRequest;
import com.rms.restaurant_management_system.dto.response.PaymentResponse;

import java.util.List;
import java.util.Map;

public interface PaymentService {

    PaymentResponse payOrder(Long orderId, PaymentRequest request);

    PaymentResponse createPayOSPayment(Long orderId);

    void handlePayOSWebhook(Map<String, Object> webhookBody);

    PaymentResponse getPaymentByOrderId(Long orderId);

    List<PaymentResponse> getAllPayments();
}