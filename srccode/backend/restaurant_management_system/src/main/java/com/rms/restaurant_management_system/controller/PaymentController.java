package com.rms.restaurant_management_system.controller;

import com.rms.restaurant_management_system.dto.request.PaymentRequest;
import com.rms.restaurant_management_system.dto.response.PaymentResponse;
import com.rms.restaurant_management_system.service.interfaces.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/orders/{orderId}")
    public PaymentResponse payOrder(
            @PathVariable Long orderId,
            @Valid @RequestBody PaymentRequest request
    ) {
        return paymentService.payOrder(orderId, request);
    }

    @PostMapping("/orders/{orderId}/payos")
    public PaymentResponse createPayOSPayment(@PathVariable Long orderId) {
        return paymentService.createPayOSPayment(orderId);
    }

    @PostMapping("/payos/webhook")
    public ResponseEntity<String> handlePayOSWebhook(@RequestBody Map<String, Object> webhookBody) {
        paymentService.handlePayOSWebhook(webhookBody);
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/orders/{orderId}")
    public PaymentResponse getPaymentByOrderId(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrderId(orderId);
    }

    @GetMapping
    public List<PaymentResponse> getAllPayments() {
        return paymentService.getAllPayments();
    }
}