package com.rms.restaurant_management_system.entity;

import com.rms.restaurant_management_system.enums.PaymentMethod;
import com.rms.restaurant_management_system.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(unique = true)
    private Long payosOrderCode;

    @Column(columnDefinition = "NVARCHAR(100)")
    private String paymentLinkId;

    @Column(columnDefinition = "NVARCHAR(1000)")
    private String checkoutUrl;

    @Column(columnDefinition = "NVARCHAR(1000)")
    private String qrCode;

    @Column(columnDefinition = "NVARCHAR(100)")
    private String transactionCode;

    @Column(columnDefinition = "NVARCHAR(500)")
    private String note;

    private LocalDateTime paidAt;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}