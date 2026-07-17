package com.rms.restaurant_management_system.controller;

import com.rms.restaurant_management_system.dto.response.StaffCustomerResponse;
import com.rms.restaurant_management_system.dto.response.UserResponse;
import com.rms.restaurant_management_system.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.rms.restaurant_management_system.dto.request.UpdateUserRoleRequest;
import com.rms.restaurant_management_system.dto.request.UpdateUserStatusRequest;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/customers")
    public List<StaffCustomerResponse> getStaffCustomers() {
        return userService.getStaffCustomers();
    }

    @GetMapping("/profile")
    public UserResponse getProfileByEmail(@RequestParam String email) {
        return userService.getProfileByEmail(email);
    }
    @PutMapping("/{userId}/role")
    public UserResponse updateUserRole(
            @PathVariable Long userId,
            @RequestBody UpdateUserRoleRequest request
    ) {
        return userService.updateUserRole(userId, request);
    }

    @PutMapping("/{userId}/status")
    public UserResponse updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UpdateUserStatusRequest request
    ) {
        return userService.updateUserStatus(userId, request);
    }
}