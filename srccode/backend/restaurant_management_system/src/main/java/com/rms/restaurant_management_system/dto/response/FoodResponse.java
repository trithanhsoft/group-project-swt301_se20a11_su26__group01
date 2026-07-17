package com.rms.restaurant_management_system.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodResponse {

    private Long foodId;

    private String foodName;

    private String description;

    private BigDecimal price;

    private String imageUrl;

    private String emoji;

    private Double rating;

    private Integer orders;

    private Boolean isAvailable;

    private Long categoryId;

    private String categoryName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}