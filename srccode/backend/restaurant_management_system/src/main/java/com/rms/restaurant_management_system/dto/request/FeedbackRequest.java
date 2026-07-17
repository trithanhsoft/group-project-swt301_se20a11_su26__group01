package com.rms.restaurant_management_system.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {

    private Long userId;

    private String customerName;

    private String customerEmail;

    private String customerPhone;

    private Long tableId;

    private String tableName;

    private String orderCode;

    @Min(value = 1, message = "Rating phải từ 1 đến 5")
    @Max(value = 5, message = "Rating phải từ 1 đến 5")
    private Integer rating;

    @NotBlank(message = "Nội dung phản hồi không được để trống")
    private String content;
}