package com.rms.restaurant_management_system.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private BigDecimal todayRevenue;
    private Long todayOrders;

    private Long occupiedTables;
    private Long totalTables;
    private Long availableTables;

    private Long todayCustomers;
    private BigDecimal totalRevenue;

    private List<RevenueByDayResponse> revenueByDays;
    private List<TopFoodResponse> topFoods;
    private List<RecentOrderResponse> recentOrders;
}