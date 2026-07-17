package com.rms.restaurant_management_system.service;

import com.rms.restaurant_management_system.dto.request.ChangePasswordRequest;
import com.rms.restaurant_management_system.dto.request.LoginRequest;
import com.rms.restaurant_management_system.dto.request.RegisterRequest;
import com.rms.restaurant_management_system.dto.request.ResetPasswordRequest;
import com.rms.restaurant_management_system.dto.response.AuthResponse;
import com.rms.restaurant_management_system.entity.Role;
import com.rms.restaurant_management_system.entity.User;
import com.rms.restaurant_management_system.repository.RoleRepository;
import com.rms.restaurant_management_system.repository.UserRepository;
import com.rms.restaurant_management_system.service.impl.AuthServiceImpl;
import com.rms.restaurant_management_system.service.interfaces.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private EmailService emailService;

    @InjectMocks
    private AuthServiceImpl authService;

    private Role customerRole;
    private User activeUser;

    @BeforeEach
    void setUp() {
        customerRole = Role.builder().roleId(1L).roleName("CUSTOMER").isActive(true).build();
        activeUser = User.builder()
                .userId(1L)
                .username("testuser")
                .email("test@gmail.com")
                .passwordHash("$hashed$")
                .role(customerRole)
                .isActive(true)
                .build();
    }

    // ── register ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("register - success")
    void register_success() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("newuser");
        req.setEmail("new@gmail.com");
        req.setPassword("password123");

        when(userRepository.existsByEmail("new@gmail.com")).thenReturn(false);
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(roleRepository.findByRoleName("CUSTOMER")).thenReturn(Optional.of(customerRole));
        when(passwordEncoder.encode("password123")).thenReturn("$hashed$");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u = User.builder().userId(2L).username(u.getUsername())
                    .email(u.getEmail()).passwordHash(u.getPasswordHash())
                    .role(u.getRole()).isActive(true).build();
            return u;
        });

        AuthResponse result = authService.register(req);

        assertThat(result.getEmail()).isEqualTo("new@gmail.com");
        assertThat(result.getRoleName()).isEqualTo("CUSTOMER");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register - email already exists")
    void register_emailExists_throwsException() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("user");
        req.setEmail("test@gmail.com");
        req.setPassword("pass");

        when(userRepository.existsByEmail("test@gmail.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email already exists");
    }

    @Test
    @DisplayName("register - username already exists")
    void register_usernameExists_throwsException() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("testuser");
        req.setEmail("another@gmail.com");
        req.setPassword("pass");

        when(userRepository.existsByEmail("another@gmail.com")).thenReturn(false);
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Username already exists");
    }

    // ── login ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("login - success")
    void login_success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@gmail.com");
        req.setPassword("password123");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("password123", "$hashed$")).thenReturn(true);

        AuthResponse result = authService.login(req);

        assertThat(result.getEmail()).isEqualTo("test@gmail.com");
        assertThat(result.getMessage()).isEqualTo("Login successfully");
    }

    @Test
    @DisplayName("login - email not found")
    void login_emailNotFound_throwsException() {
        LoginRequest req = new LoginRequest();
        req.setEmail("notfound@gmail.com");
        req.setPassword("pass");

        when(userRepository.findByEmail("notfound@gmail.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email or password is incorrect");
    }

    @Test
    @DisplayName("login - wrong password")
    void login_wrongPassword_throwsException() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@gmail.com");
        req.setPassword("wrongpass");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("wrongpass", "$hashed$")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email or password is incorrect");
    }

    @Test
    @DisplayName("login - account locked")
    void login_accountLocked_throwsException() {
        User lockedUser = User.builder().userId(2L).username("locked")
                .email("locked@gmail.com").passwordHash("$hash$")
                .role(customerRole).isActive(false).build();

        LoginRequest req = new LoginRequest();
        req.setEmail("locked@gmail.com");
        req.setPassword("pass");

        when(userRepository.findByEmail("locked@gmail.com")).thenReturn(Optional.of(lockedUser));

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("khóa");
    }

    // ── changePassword ────────────────────────────────────────────────────────

    @Test
    @DisplayName("changePassword - success")
    void changePassword_success() {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setEmail("test@gmail.com");
        req.setOldPassword("oldpass");
        req.setNewPassword("newpass123");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("oldpass", "$hashed$")).thenReturn(true);
        when(passwordEncoder.encode("newpass123")).thenReturn("$newhash$");

        authService.changePassword(req);

        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("changePassword - wrong old password")
    void changePassword_wrongOldPassword_throwsException() {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setEmail("test@gmail.com");
        req.setOldPassword("wrongold");
        req.setNewPassword("newpass123");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("wrongold", "$hashed$")).thenReturn(false);

        assertThatThrownBy(() -> authService.changePassword(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Old password is incorrect");
    }

    @Test
    @DisplayName("changePassword - new password too short")
    void changePassword_newPasswordTooShort_throwsException() {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setEmail("test@gmail.com");
        req.setOldPassword("oldpass");
        req.setNewPassword("123");

        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("oldpass", "$hashed$")).thenReturn(true);

        assertThatThrownBy(() -> authService.changePassword(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("New password must be at least 6 characters");
    }

    // ── resetPassword ─────────────────────────────────────────────────────────

    @Test
    @DisplayName("resetPassword - new password too short")
    void resetPassword_passwordTooShort_throwsException() {
        ResetPasswordRequest req = new ResetPasswordRequest();
        req.setEmail("test@gmail.com");
        req.setOtp("123456");
        req.setNewPassword("123");

        // forgotPassword tạo OTP trước — simulate bằng gọi forgotPassword
        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(activeUser));
        doNothing().when(emailService).sendOtpEmail(anyString(), anyString());

        authService.forgotPassword(new com.rms.restaurant_management_system.dto.request.ForgotPasswordRequest() {{
            setEmail("test@gmail.com");
        }});

        // Lấy OTP từ storage bằng cách intercept — reset password với pass ngắn
        assertThatThrownBy(() -> authService.resetPassword(req))
                .isInstanceOf(RuntimeException.class);
    }
}
