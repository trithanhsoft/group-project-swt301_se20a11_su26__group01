package com.rms.restaurant_management_system.entity;

import com.rms.restaurant_management_system.enums.FeedbackStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    @Column(columnDefinition = "NVARCHAR(150)")
    private String customerName;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String customerEmail;

    @Column(columnDefinition = "NVARCHAR(30)")
    private String customerPhone;

    @Column(name = "table_id")
    private Long tableId;

    @Column(name = "table_name", columnDefinition = "NVARCHAR(50)")
    private String tableName;

    @Column(name = "order_code", columnDefinition = "NVARCHAR(50)")
    private String orderCode;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false, columnDefinition = "NVARCHAR(1000)")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private FeedbackStatus status;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}