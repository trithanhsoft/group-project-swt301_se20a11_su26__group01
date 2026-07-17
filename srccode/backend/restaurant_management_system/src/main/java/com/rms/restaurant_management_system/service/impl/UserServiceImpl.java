package com.rms.restaurant_management_system.service.impl;

import com.rms.restaurant_management_system.dto.request.UpdateUserRoleRequest;
import com.rms.restaurant_management_system.dto.request.UpdateUserStatusRequest;
import com.rms.restaurant_management_system.dto.response.StaffCustomerResponse;
import com.rms.restaurant_management_system.dto.response.UserResponse;
import com.rms.restaurant_management_system.entity.Order;
import com.rms.restaurant_management_system.entity.Role;
import com.rms.restaurant_management_system.entity.User;
import com.rms.restaurant_management_system.enums.OrderStatus;
import com.rms.restaurant_management_system.repository.OrderRepository;
import com.rms.restaurant_management_system.repository.RoleRepository;
import com.rms.restaurant_management_system.repository.UserRepository;
import com.rms.restaurant_management_system.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final RoleRepository roleRepository;

    @Override
    public UserResponse getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffCustomerResponse> getStaffCustomers() {
        List<User> customers = userRepository.findAll()
                .stream()
                .filter(this::isCustomer)
                .toList();

        List<Order> orders = orderRepository.findAll();

        Map<Long, List<Order>> ordersByUserId = orders.stream()
                .filter(order -> order.getUser() != null)
                .collect(Collectors.groupingBy(order -> order.getUser().getUserId()));

        return customers.stream()
                .map(customer -> {
                    List<Order> customerOrders = ordersByUserId.getOrDefault(
                            customer.getUserId(),
                            List.of()
                    );

                    long totalOrders = customerOrders.size();

                    long activeOrders = customerOrders.stream()
                            .filter(order -> order.getStatus() == OrderStatus.PENDING
                                    || order.getStatus() == OrderStatus.CONFIRMED
                                    || order.getStatus() == OrderStatus.PREPARING
                                    || order.getStatus() == OrderStatus.READY)
                            .count();

                    long completedOrders = customerOrders.stream()
                            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                            .count();

                    long cancelledOrders = customerOrders.stream()
                            .filter(order -> order.getStatus() == OrderStatus.CANCELLED)
                            .count();

                    BigDecimal totalSpent = customerOrders.stream()
                            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                            .map(order -> order.getTotalAmount() != null
                                    ? order.getTotalAmount()
                                    : BigDecimal.ZERO)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    Order lastOrder = customerOrders.stream()
                            .filter(order -> order.getCreatedAt() != null)
                            .max(Comparator.comparing(Order::getCreatedAt))
                            .orElse(null);

                    return new StaffCustomerResponse(
                            customer.getUserId(),
                            customer.getUsername(),
                            customer.getEmail(),
                            customer.getIsActive(),
                            customer.getCreatedAt(),
                            totalOrders,
                            activeOrders,
                            completedOrders,
                            cancelledOrders,
                            totalSpent,
                            lastOrder != null ? lastOrder.getCreatedAt() : null,
                            lastOrder != null ? lastOrder.getOrderCode() : null,
                            lastOrder != null ? lastOrder.getStatus() : null,
                            lastOrder != null ? lastOrder.getCustomerPhone() : null
                    );
                })
                .sorted(Comparator.comparing(
                        StaffCustomerResponse::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .toList();
    }

    @Override
    public UserResponse updateUserRole(Long userId, UpdateUserRoleRequest request) {
        if (request.getCurrentUserId() != null && request.getCurrentUserId().equals(userId)) {
            throw new RuntimeException("Bạn không thể tự đổi vai trò của chính mình.");
        }

        if (request.getRoleName() == null || request.getRoleName().isBlank()) {
            throw new RuntimeException("Vai trò không được để trống.");
        }

        String roleName = request.getRoleName().trim().toUpperCase();

        if (!roleName.equals("ADMIN")
                && !roleName.equals("STAFF")
                && !roleName.equals("KITCHEN")
                && !roleName.equals("CUSTOMER")) {
            throw new RuntimeException("Vai trò không hợp lệ.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        user.setRole(role);

        return mapToUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUserStatus(Long userId, UpdateUserStatusRequest request) {
        if (request.getCurrentUserId() != null && request.getCurrentUserId().equals(userId)) {
            throw new RuntimeException("Bạn không thể tự khóa tài khoản của chính mình.");
        }

        if (request.getIsActive() == null) {
            throw new RuntimeException("Trạng thái không được để trống.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsActive(request.getIsActive());

        return mapToUserResponse(userRepository.save(user));
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getRoleName(),
                user.getIsActive(),
                user.getCreatedAt()
        );
    }

    private boolean isCustomer(User user) {
        if (user.getRole() == null || user.getRole().getRoleName() == null) {
            return false;
        }

        String roleName = user.getRole().getRoleName().trim().toUpperCase();

        return roleName.equals("CUSTOMER")
                || roleName.equals("KHÁCH HÀNG")
                || roleName.equals("KHACH HANG");
    }
}