package com.rms.restaurant_management_system.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {

    private String categoryName;

    private String description;

    private String imageUrl;

    private Boolean isActive;
}