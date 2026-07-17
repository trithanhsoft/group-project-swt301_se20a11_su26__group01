import React, { createContext, useContext, useState } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      sessionStorage.removeItem('user');
      return null;
    }
  });

  const getApiMessage = (data, fallback) => {
    if (!data) {
      return fallback;
    }

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object') {
      return (
        data.message ||
        data.detail ||
        fallback
      );
    }

    return fallback;
  };

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', {
        email,
        password
      });

      const userData = response.data;

      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));

      return {
        success: true,
        user: userData,
        role: userData.roleName
      };
    } catch (error) {
      console.error('Login error:', error);

      return {
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      };
    }
  };

  const register = async ({ username, email, password }) => {
    try {
      const response = await API.post('/auth/register', {
        username,
        email,
        password
      });

      return {
        success: true,
        user: response.data,
        message: 'Đăng ký thành công'
      };
    } catch (error) {
      console.error('Register error:', error);

      return {
        success: false,
        message: getApiMessage(
          error.response?.data,
          'Đăng ký thất bại'
        )
      };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      if (!user?.email) {
        return {
          success: false,
          message: 'Không tìm thấy thông tin người dùng'
        };
      }

      const response = await API.post('/auth/change-password', {
        email: user.email,
        oldPassword,
        newPassword
      });

      return {
        success: true,
        message:
          typeof response.data === 'string'
            ? response.data
            : 'Đổi mật khẩu thành công'
      };
    } catch (error) {
      console.error('Change password error:', error);

      return {
        success: false,
        message: getApiMessage(
          error.response?.data,
          'Đổi mật khẩu thất bại'
        )
      };
    }
  };

  const logout = () => {
    setUser(null);

    sessionStorage.removeItem('user');
    sessionStorage.removeItem('restaurant_user');

    // Xóa thêm dữ liệu cũ trong localStorage để tránh bị đọc nhầm từ bản cũ
    localStorage.removeItem('user');
    localStorage.removeItem('restaurant_user');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const getRole = () => {
    return (user?.roleName || user?.role || '').toUpperCase();
  };

  const hasRole = (roles) => {
    if (!user) return false;

    if (!roles || roles.length === 0) {
      return true;
    }

    const userRole = getRole();
    const allowedRoles = roles.map((role) => role.toUpperCase());

    return allowedRoles.includes(userRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        changePassword,
        logout,
        isAuthenticated,
        getRole,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}