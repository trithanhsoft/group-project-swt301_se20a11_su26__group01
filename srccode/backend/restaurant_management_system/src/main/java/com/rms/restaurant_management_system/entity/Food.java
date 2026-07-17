package com.rms.restaurant_management_system.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "foods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long foodId;

    @Column(nullable = false, columnDefinition = "NVARCHAR(150)")
    private String foodName;

    @Column(columnDefinition = "NVARCHAR(500)")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(columnDefinition = "NVARCHAR(500)")
    private String imageUrl;

    @Column(columnDefinition = "NVARCHAR(50)")
    private String emoji;

    @Builder.Default
    private Double rating = 0.0;

    @Builder.Default
    private Integer orders = 0;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isAvailable = true;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}