package com.rms.restaurant_management_system.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MergeTableRequest {

    @NotNull(message = "Target table ID is required")
    private Long targetTableId;
}