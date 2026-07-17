package com.rms.restaurant_management_system.entity;

import com.rms.restaurant_management_system.enums.TableStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tableId;

    @Column(nullable = false, unique = true, columnDefinition = "NVARCHAR(50)")
    private String tableName;

    @Column(nullable = false)
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TableStatus status;

    @Column(columnDefinition = "NVARCHAR(100)")
    private String currentOrderCode;

    @Column(columnDefinition = "NVARCHAR(150)")
    private String reservedBy;

    @Column(columnDefinition = "NVARCHAR(100)")
    private String mergedInto;

    @Column(columnDefinition = "NVARCHAR(500)")
    private String mergedWith;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}