package com.rms.restaurant_management_system.controller;

import com.rms.restaurant_management_system.dto.request.ChangePasswordRequest;
import com.rms.restaurant_management_system.dto.request.LoginRequest;
import com.rms.restaurant_management_system.dto.request.RegisterRequest;
import com.rms.restaurant_management_system.dto.response.AuthResponse;
import com.rms.restaurant_management_system.service.interfaces.AuthService;
import com.rms.restaurant_management_system.dto.request.ForgotPasswordRequest;
import com.rms.restaurant_management_system.dto.request.ResetPasswordRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/change-password")
    public String changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return "Change password successfully";
    }
        @PostMapping("/forgot-password")
    public String forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return "Reset password successfully";
    }
}