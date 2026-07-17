package com.rms.restaurant_management_system.service;

import com.rms.restaurant_management_system.dto.request.UpdateUserRoleRequest;
import com.rms.restaurant_management_system.dto.request.UpdateUserStatusRequest;
import com.rms.restaurant_management_system.dto.response.UserResponse;
import com.rms.restaurant_management_system.entity.Role;
import com.rms.restaurant_management_system.entity.User;
import com.rms.restaurant_management_system.repository.OrderRepository;
import com.rms.restaurant_management_system.repository.RoleRepository;
import com.rms.restaurant_management_system.repository.UserRepository;
import com.rms.restaurant_management_system.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private RoleRepository roleRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private Role adminRole;
    private Role staffRole;
    private User adminUser;
    private User targetUser;

    @BeforeEach
    void setUp() {
        adminRole = Role.builder().roleId(1L).roleName("ADMIN").isActive(true).build();
        staffRole = Role.builder().roleId(2L).roleName("STAFF").isActive(true).build();

        adminUser = User.builder().userId(1L).username("admin")
                .email("admin@gmail.com").role(adminRole).isActive(true).build();

        targetUser = User.builder().userId(2L).username("target")
                .email("target@gmail.com").role(staffRole).isActive(true).build();
    }

    // ── getProfileByEmail ─────────────────────────────────────────────────────

    @Test
    @DisplayName("getProfileByEmail - success")
    void getProfileByEmail_success() {
        when(userRepository.findByEmail("admin@gmail.com")).thenReturn(Optional.of(adminUser));

        UserResponse result = userService.getProfileByEmail("admin@gmail.com");

        assertThat(result.getEmail()).isEqualTo("admin@gmail.com");
        assertThat(result.getRoleName()).isEqualTo("ADMIN");
    }

    @Test
    @DisplayName("getProfileByEmail - not found")
    void getProfileByEmail_notFound_throwsException() {
        when(userRepository.findByEmail("notfound@gmail.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getProfileByEmail("notfound@gmail.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    // ── getAllUsers ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("getAllUsers - returns list")
    void getAllUsers_returnsList() {
        when(userRepository.findAll()).thenReturn(List.of(adminUser, targetUser));

        List<UserResponse> result = userService.getAllUsers();

        assertThat(result).hasSize(2);
    }

    // ── updateUserRole ────────────────────────────────────────────────────────

    @Test
    @DisplayName("updateUserRole - success")
    void updateUserRole_success() {
        UpdateUserRoleRequest req = new UpdateUserRoleRequest();
        req.setCurrentUserId(1L);
        req.setRoleName("STAFF");

        when(userRepository.findById(2L)).thenReturn(Optional.of(targetUser));
        when(roleRepository.findByRoleName("STAFF")).thenReturn(Optional.of(staffRole));
        when(userRepository.save(any(User.class))).thenReturn(targetUser);

        UserResponse result = userService.updateUserRole(2L, req);

        assertThat(result).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("updateUserRole - cannot change own role")
    void updateUserRole_selfChange_throwsException() {
        UpdateUserRoleRequest req = new UpdateUserRoleRequest();
        req.setCurrentUserId(1L);
        req.setRoleName("STAFF");

        assertThatThrownBy(() -> userService.updateUserRole(1L, req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("chính mình");
    }

    @Test
    @DisplayName("updateUserRole - invalid role name")
    void updateUserRole_invalidRole_throwsException() {
        UpdateUserRoleRequest req = new UpdateUserRoleRequest();
        req.setCurrentUserId(1L);
        req.setRoleName("INVALID_ROLE");

        assertThatThrownBy(() -> userService.updateUserRole(2L, req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("không hợp lệ");
    }

    @Test
    @DisplayName("updateUserRole - blank role name")
    void updateUserRole_blankRole_throwsException() {
        UpdateUserRoleRequest req = new UpdateUserRoleRequest();
        req.setCurrentUserId(1L);
        req.setRoleName("  ");

        assertThatThrownBy(() -> userService.updateUserRole(2L, req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("trống");
    }

    @Test
    @DisplayName("updateUserRole - user not found")
    void updateUserRole_userNotFound_throwsException() {
        UpdateUserRoleRequest req = new UpdateUserRoleRequest();
        req.setCurrentUserId(1L);
        req.setRoleName("STAFF");

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateUserRole(99L, req))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    // ── updateUserStatus ──────────────────────────────────────────────────────

    @Test
    @DisplayName("updateUserStatus - lock account success")
    void updateUserStatus_lockAccount_success() {
        UpdateUserStatusRequest req = new UpdateUserStatusRequest();
        req.setCurrentUserId(1L);
        req.setIsActive(false);

        when(userRepository.findById(2L)).thenReturn(Optional.of(targetUser));
        when(userRepository.save(any(User.class))).thenReturn(targetUser);

        UserResponse result = userService.updateUserStatus(2L, req);

        assertThat(result).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("updateUserStatus - cannot lock own account")
    void updateUserStatus_selfLock_throwsException() {
        UpdateUserStatusRequest req = new UpdateUserStatusRequest();
        req.setCurrentUserId(1L);
        req.setIsActive(false);

        assertThatThrownBy(() -> userService.updateUserStatus(1L, req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("chính mình");
    }

    @Test
    @DisplayName("updateUserStatus - null isActive")
    void updateUserStatus_nullIsActive_throwsException() {
        UpdateUserStatusRequest req = new UpdateUserStatusRequest();
        req.setCurrentUserId(1L);
        req.setIsActive(null);

        assertThatThrownBy(() -> userService.updateUserStatus(2L, req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("trống");
    }
}
