package com.rms.restaurant_management_system.service.interfaces;

import com.rms.restaurant_management_system.dto.request.OrderRequest;
import com.rms.restaurant_management_system.dto.request.UpdateOrderStatusRequest;
import com.rms.restaurant_management_system.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request);

    List<OrderResponse> getAllOrders();

    OrderResponse getOrderById(Long orderId);

    List<OrderResponse> getOrdersByCustomer(Long userId);

    List<OrderResponse> getOrdersByStatus(String status);

    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);

    void cancelOrder(Long orderId);
}