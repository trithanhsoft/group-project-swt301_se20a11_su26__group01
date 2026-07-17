package com.rms.restaurant_management_system.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodRequest {

    private String foodName;

    private String description;

    private BigDecimal price;

    private String imageUrl;

    private String emoji;

    private Double rating;

    private Integer orders;

    private Boolean isAvailable;

    private Long categoryId;
}