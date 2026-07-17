package com.rms.restaurant_management_system.dto.response;

import com.rms.restaurant_management_system.enums.TableStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class TableResponse {

    private Long tableId;

    private String tableName;

    private Integer capacity;

    private TableStatus status;

    private String currentOrderCode;

    private String reservedBy;

    private String mergedInto;

    private String mergedWith;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}