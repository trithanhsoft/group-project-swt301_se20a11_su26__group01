package com.rms.restaurant_management_system.service.impl;


import com.rms.restaurant_management_system.dto.request.OrderItemRequest;
import com.rms.restaurant_management_system.dto.request.OrderRequest;
import com.rms.restaurant_management_system.dto.request.UpdateOrderStatusRequest;
import com.rms.restaurant_management_system.dto.response.OrderItemResponse;
import com.rms.restaurant_management_system.dto.response.OrderResponse;

import com.rms.restaurant_management_system.entity.Food;
import com.rms.restaurant_management_system.entity.Order;
import com.rms.restaurant_management_system.entity.OrderItem;
import com.rms.restaurant_management_system.entity.RestaurantTable;
import com.rms.restaurant_management_system.entity.User;

import com.rms.restaurant_management_system.enums.OrderStatus;
import com.rms.restaurant_management_system.enums.TableStatus;

import com.rms.restaurant_management_system.repository.FoodRepository;
import com.rms.restaurant_management_system.repository.OrderRepository;
import com.rms.restaurant_management_system.repository.RestaurantTableRepository;
import com.rms.restaurant_management_system.repository.UserRepository;

import com.rms.restaurant_management_system.service.interfaces.OrderService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;



@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {



    private final OrderRepository orderRepository;

    private final UserRepository userRepository;

    private final FoodRepository foodRepository;

    private final RestaurantTableRepository restaurantTableRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {

        User user = null;

        // Customer QR không cần đăng nhập
        if(request.getUserId() != null){

            user = userRepository.findById(request.getUserId())

                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found"
                            )
                    );
        }

        RestaurantTable table = null;

        if(request.getTableId() != null){


            table =
                    restaurantTableRepository
                            .findById(request.getTableId())

                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Table not found"
                                    )
                            );

            if(!table.getIsActive()){

                throw new RuntimeException(
                        "Table is inactive"
                );
            }


            /*
             * KHÔNG CHECK OCCUPIED
             *
             * Vì QR ordering:
             * - khách đang ngồi vẫn gọi thêm món
             * - bàn có khách vẫn order tiếp được
             */

        }

        String customerName =
                request.getCustomerName();


        if(
                (customerName == null
                || customerName.isBlank())

                && user != null
        ){

            customerName =
                    user.getUsername();

        }


        if(
                (customerName == null
                || customerName.isBlank())

                && table != null
        ){

            customerName =
                    "Khách " + table.getTableName();

        }

        Order order =
                Order.builder()

                .orderCode(
                        generateOrderCode()
                )

                .user(user)

                .tableId(
                        table != null
                        ? table.getTableId()
                        : null
                )

                .tableName(
                        table != null
                        ? table.getTableName()
                        : null
                )

                .customerName(
                        customerName
                )


                .customerPhone(
                        request.getCustomerPhone()
                )


                .status(
                        OrderStatus.PENDING
                )


                .note(
                        request.getNote()
                )


                .totalAmount(
                        BigDecimal.ZERO
                )


                .items(
                        new ArrayList<>()
                )

                .build();


        BigDecimal totalAmount =
                BigDecimal.ZERO;


        for(OrderItemRequest itemRequest :
                request.getItems()) {

            Food food =
                    foodRepository
                            .findById(
                                    itemRequest.getFoodId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Food not found"
                                    )
                            );
            if(!food.getIsAvailable()){


                throw new RuntimeException(
                        "Food unavailable"
                );

            }
            BigDecimal subtotal =

                    food.getPrice()

                    .multiply(
                            BigDecimal.valueOf(
                                    itemRequest.getQuantity()
                            )
                    );
            OrderItem item =

                    OrderItem.builder()

                    .order(order)

                    .foodId(
                            food.getFoodId()
                    )
                    .foodName(
                            food.getFoodName()
                    )
                    .unitPrice(
                            food.getPrice()
                    )
                    .quantity(
                            itemRequest.getQuantity()
                    )
                    .subtotal(
                            subtotal
                    )
                    .imageUrl(
                            food.getImageUrl()
                    )
                    .emoji(
                            food.getEmoji()
                    )
                    .build();
            order.getItems()
                    .add(item);
            totalAmount =
                    totalAmount.add(subtotal);
        }
        order.setTotalAmount(
                totalAmount
        );
        Order savedOrder =
                orderRepository.save(order);
        if(table != null){
            table.setStatus(
                    TableStatus.OCCUPIED
            );
            table.setCurrentOrderCode(
                    savedOrder.getOrderCode()
            );
            table.setReservedBy(
                    customerName
            );
            restaurantTableRepository.save(table);
        }
        return mapToResponse(savedOrder);
    }
    @Override
    public List<OrderResponse> getAllOrders(){

        return orderRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public OrderResponse getOrderById(Long orderId){
        Order order =
                orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );
        return mapToResponse(order);
    }
    @Override
    public List<OrderResponse> getOrdersByCustomer(Long userId){
        return orderRepository
                .findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public List<OrderResponse> getOrdersByStatus(String status){
        OrderStatus orderStatus;
        try{
            orderStatus =
                    OrderStatus.valueOf(
                            status.toUpperCase()
                    );
        }catch(Exception e){
            throw new RuntimeException(
                    "Invalid order status"
            );
        }
        return orderRepository
                .findByStatusOrderByCreatedAtDesc(
                        orderStatus
                )
                .stream()
                .map(this::mapToResponse)
                .toList();

    }
    @Override
    @Transactional
    public OrderResponse updateOrderStatus(

            Long orderId,

            UpdateOrderStatusRequest request

    ){
        Order order =
                orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );
        validateStatusTransition(

                order.getStatus(),

                request.getStatus()

        );
        order.setStatus(
                request.getStatus()
        );
        Order savedOrder =
                orderRepository.save(order);
        if(
                request.getStatus()
                        == OrderStatus.COMPLETED
                ||
                request.getStatus()
                        == OrderStatus.CANCELLED
        ){
            releaseTable(savedOrder);

        }
        return mapToResponse(savedOrder);
    }
    @Override
    @Transactional
    public void cancelOrder(Long orderId){
        Order order =
                orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );

        order.setStatus(
                OrderStatus.CANCELLED
        );
        Order savedOrder =
                orderRepository.save(order);
        releaseTable(savedOrder);
    }
    private void releaseTable(Order order){
        if(order.getTableId() == null)
            return;
        RestaurantTable table =
                restaurantTableRepository
                        .findById(order.getTableId())

                        .orElse(null);
        if(table == null)

            return;
        table.setStatus(
                TableStatus.EMPTY
        );
        table.setCurrentOrderCode(
                null
        );
        table.setReservedBy(
                null
        );
        restaurantTableRepository.save(table);
    }
    private void validateStatusTransition(
            OrderStatus current,
            OrderStatus next
    ){
        boolean valid =
                switch(current){
                    case PENDING ->
                            next == OrderStatus.CONFIRMED
                            ||
                            next == OrderStatus.CANCELLED;
                    case CONFIRMED ->
                            next == OrderStatus.PREPARING
                            ||
                            next == OrderStatus.CANCELLED;
                    case PREPARING ->
                            next == OrderStatus.READY
                            ||
                            next == OrderStatus.CANCELLED;
                    case READY ->
                            next == OrderStatus.COMPLETED;
                    default -> false;
                };
        if(!valid){
            throw new RuntimeException(
                    "Invalid status transition"
            );
        }
    }
    private OrderResponse mapToResponse(Order order){
        List<OrderItemResponse> items =
                order.getItems()
                .stream()
                .map(item ->
                        new OrderItemResponse(
                                item.getOrderItemId(),
                                item.getFoodId(),
                                item.getFoodName(),
                                item.getUnitPrice(),
                                item.getQuantity(),
                                item.getSubtotal(),
                                item.getImageUrl(),
                                item.getEmoji()
                        )
                )
                .toList();
        return new OrderResponse(
                order.getOrderId(),
                order.getOrderCode(),
                order.getUser() != null
                        ?
                        order.getUser().getUserId()
                        :
                        null,
                order.getUser() != null
                        ?
                        order.getUser().getUsername()
                        :
                        order.getCustomerName(),
                order.getUser() != null
                        ?
                        order.getUser().getEmail()
                        :
                        null,
                order.getTableId(),
                order.getTableName(),
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getNote(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                items
        );

    }
    private String generateOrderCode(){
        String time =
                java.time.LocalDateTime.now()
                .format(

                        DateTimeFormatter
                        .ofPattern(
                                "yyyyMMddHHmmss"
                        )

                );
        int random =

                (int)(Math.random()*9000)+1000;
        return "ORD-"
                + time
                + "-"
                + random;
    }


}