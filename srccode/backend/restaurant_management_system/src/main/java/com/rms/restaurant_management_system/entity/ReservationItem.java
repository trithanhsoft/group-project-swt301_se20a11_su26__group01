package com.rms.restaurant_management_system.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "reservation_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationItemId;

    @Column(nullable = false)
    private Long foodId;

    @Column(nullable = false, columnDefinition = "NVARCHAR(150)")
    private String foodName;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(columnDefinition = "NVARCHAR(500)")
    private String imageUrl;

    @Column(columnDefinition = "NVARCHAR(50)")
    private String emoji;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;
}