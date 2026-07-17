package com.rms.restaurant_management_system.service.impl;

import com.rms.restaurant_management_system.dto.request.ChangePasswordRequest;
import com.rms.restaurant_management_system.dto.request.ForgotPasswordRequest;
import com.rms.restaurant_management_system.dto.request.LoginRequest;
import com.rms.restaurant_management_system.dto.request.RegisterRequest;
import com.rms.restaurant_management_system.dto.request.ResetPasswordRequest;
import com.rms.restaurant_management_system.dto.response.AuthResponse;
import com.rms.restaurant_management_system.entity.Role;
import com.rms.restaurant_management_system.entity.User;
import com.rms.restaurant_management_system.repository.RoleRepository;
import com.rms.restaurant_management_system.repository.UserRepository;
import com.rms.restaurant_management_system.service.interfaces.AuthService;
import com.rms.restaurant_management_system.service.interfaces.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final ConcurrentHashMap<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        Role customerRole = roleRepository.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Role CUSTOMER not found"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(customerRole)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                savedUser.getUserId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole().getRoleName(),
                "Register successfully"
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email or password is incorrect"));

        if (user.getIsActive() == null || !user.getIsActive()) {
            throw new RuntimeException("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        boolean isPasswordCorrect = passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        );

        if (!isPasswordCorrect) {
            throw new RuntimeException("Email or password is incorrect");
        }

        return new AuthResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getRoleName(),
                "Login successfully"
        );
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOldPasswordCorrect = passwordEncoder.matches(
                request.getOldPassword(),
                user.getPasswordHash()
        );

        if (!isOldPasswordCorrect) {
            throw new RuntimeException("Old password is incorrect");
        }

        if (request.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    @Override
    public String forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email not found"));

        if (user.getIsActive() == null || !user.getIsActive()) {
            throw new RuntimeException("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        String otp = generateOtp();

        otpStorage.put(
                user.getEmail(),
                new OtpData(
                        otp,
                        LocalDateTime.now().plusMinutes(5)
                )
        );

        emailService.sendOtpEmail(user.getEmail(), otp);

        return "OTP has been sent to your email";
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email not found"));

        if (user.getIsActive() == null || !user.getIsActive()) {
            throw new RuntimeException("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        OtpData otpData = otpStorage.get(request.getEmail());

        if (otpData == null) {
            throw new RuntimeException("OTP not found or expired");
        }

        if (LocalDateTime.now().isAfter(otpData.getExpiredAt())) {
            otpStorage.remove(request.getEmail());
            throw new RuntimeException("OTP has expired");
        }

        if (!otpData.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("OTP is incorrect");
        }

        if (request.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpStorage.remove(request.getEmail());
    }

    private String generateOtp() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }

    private static class OtpData {

        private final String otp;
        private final LocalDateTime expiredAt;

        public OtpData(String otp, LocalDateTime expiredAt) {
            this.otp = otp;
            this.expiredAt = expiredAt;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiredAt() {
            return expiredAt;
        }
    }
}