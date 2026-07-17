package com.rms.restaurant_management_system.entity;

import com.rms.restaurant_management_system.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationId;

    @Column(nullable = false, unique = true, length = 50)
    private String reservationCode;

    @Column(nullable = false)
    private LocalDate reservationDate;

    @Column(nullable = false, length = 10)
    private String reservationTime;

    @Column(nullable = false)
    private Integer numberOfGuests;

    @Column(nullable = false, columnDefinition = "NVARCHAR(150)")
    private String customerName;

    @Column(nullable = false, length = 30)
    private String customerPhone;

    @Column(length = 255)
    private String customerEmail;

    @Column(columnDefinition = "NVARCHAR(500)")
    private String note;
    
    @Column(columnDefinition = "NVARCHAR(50)")
    private String assignedTable;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReservationStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal preOrderTotal;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Builder.Default
    @OneToMany(
            mappedBy = "reservation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ReservationItem> items = new ArrayList<>();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}