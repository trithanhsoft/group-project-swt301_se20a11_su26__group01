package com.rms.restaurant_management_system.service.impl;

import com.rms.restaurant_management_system.dto.response.DashboardSummaryResponse;
import com.rms.restaurant_management_system.dto.response.RecentOrderResponse;
import com.rms.restaurant_management_system.dto.response.RevenueByDayResponse;
import com.rms.restaurant_management_system.dto.response.TopFoodResponse;
import com.rms.restaurant_management_system.entity.Order;
import com.rms.restaurant_management_system.entity.OrderItem;
import com.rms.restaurant_management_system.entity.Payment;
import com.rms.restaurant_management_system.entity.RestaurantTable;
import com.rms.restaurant_management_system.enums.PaymentStatus;
import com.rms.restaurant_management_system.enums.TableStatus;
import com.rms.restaurant_management_system.repository.OrderRepository;
import com.rms.restaurant_management_system.repository.PaymentRepository;
import com.rms.restaurant_management_system.repository.RestaurantTableRepository;
import com.rms.restaurant_management_system.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final RestaurantTableRepository restaurantTableRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        List<Order> orders = orderRepository.findAll();
        List<Payment> payments = paymentRepository.findAll();
        List<RestaurantTable> tables = restaurantTableRepository.findAll();

        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime startOfTomorrow = today.plusDays(1).atStartOfDay();

        List<Payment> paidPayments = payments.stream()
                .filter(payment -> payment.getStatus() == PaymentStatus.PAID)
                .toList();

        BigDecimal todayRevenue = paidPayments.stream()
                .filter(payment -> payment.getPaidAt() != null)
                .filter(payment ->
                        !payment.getPaidAt().isBefore(startOfToday)
                                && payment.getPaidAt().isBefore(startOfTomorrow)
                )
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRevenue = paidPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Long todayOrders = orders.stream()
                .filter(order -> order.getCreatedAt() != null)
                .filter(order ->
                        !order.getCreatedAt().isBefore(startOfToday)
                                && order.getCreatedAt().isBefore(startOfTomorrow)
                )
                .count();

        Long totalTables = tables.stream()
                .filter(table -> Boolean.TRUE.equals(table.getIsActive()))
                .count();

        Long occupiedTables = tables.stream()
                .filter(table -> Boolean.TRUE.equals(table.getIsActive()))
                .filter(table -> table.getStatus() == TableStatus.OCCUPIED)
                .count();

        Long availableTables = tables.stream()
                .filter(table -> Boolean.TRUE.equals(table.getIsActive()))
                .filter(table -> table.getStatus() == TableStatus.EMPTY)
                .count();

        Long todayCustomers = orders.stream()
                .filter(order -> order.getCreatedAt() != null)
                .filter(order ->
                        !order.getCreatedAt().isBefore(startOfToday)
                                && order.getCreatedAt().isBefore(startOfTomorrow)
                )
                .count();

        List<RevenueByDayResponse> revenueByDays = buildRevenueByDays(paidPayments);
        List<TopFoodResponse> topFoods = buildTopFoods(orders);
        List<RecentOrderResponse> recentOrders = buildRecentOrders(orders);

        return new DashboardSummaryResponse(
                todayRevenue,
                todayOrders,
                occupiedTables,
                totalTables,
                availableTables,
                todayCustomers,
                totalRevenue,
                revenueByDays,
                topFoods,
                recentOrders
        );
    }

    private List<RevenueByDayResponse> buildRevenueByDays(List<Payment> paidPayments) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(6);

        Map<LocalDate, BigDecimal> revenueMap = new LinkedHashMap<>();

        for (int i = 0; i < 7; i++) {
            LocalDate date = startDate.plusDays(i);
            revenueMap.put(date, BigDecimal.ZERO);
        }

        paidPayments.stream()
                .filter(payment -> payment.getPaidAt() != null)
                .forEach(payment -> {
                    LocalDate paidDate = payment.getPaidAt().toLocalDate();

                    if (!paidDate.isBefore(startDate) && !paidDate.isAfter(today)) {
                        BigDecimal currentRevenue = revenueMap.getOrDefault(paidDate, BigDecimal.ZERO);
                        revenueMap.put(paidDate, currentRevenue.add(payment.getAmount()));
                    }
                });

        return revenueMap.entrySet()
                .stream()
                .map(entry -> new RevenueByDayResponse(
                        toVietnameseDay(entry.getKey().getDayOfWeek()),
                        entry.getValue()
                ))
                .toList();
    }

    private List<TopFoodResponse> buildTopFoods(List<Order> orders) {
        Map<String, Long> foodQuantityMap = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(
                        OrderItem::getFoodName,
                        Collectors.summingLong(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                ));

        return foodQuantityMap.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> new TopFoodResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<RecentOrderResponse> buildRecentOrders(List<Order> orders) {
        return orders.stream()
                .sorted(Comparator.comparing(
                        Order::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(6)
                .map(order -> new RecentOrderResponse(
                        order.getOrderId(),
                        order.getOrderCode(),
                        order.getTableName(),
                        countItems(order),
                        order.getTotalAmount(),
                        order.getStatus()
                ))
                .toList();
    }

    private Integer countItems(Order order) {
        if (order.getItems() == null) {
            return 0;
        }

        return order.getItems()
                .stream()
                .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                .sum();
    }

    private String toVietnameseDay(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> "T2";
            case TUESDAY -> "T3";
            case WEDNESDAY -> "T4";
            case THURSDAY -> "T5";
            case FRIDAY -> "T6";
            case SATURDAY -> "T7";
            case SUNDAY -> "CN";
        };
    }
}