import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const DEFAULT_ACCOUNTS = [
  { username: 'admin',    password: 'admin123',  role: 'admin',   name: 'Admin',      banned: false },
  { username: 'staff',    password: 'staff123',  role: 'staff',   name: 'Nhân viên',  banned: false },
  { username: 'kitchen',  password: 'kitchen123',role: 'kitchen', name: 'Bếp',        banned: false },
  { username: 'customer', password: 'cust123',   role: 'customer',name: 'Khách hàng', banned: false },
];

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('cgkc_accounts');
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('restaurant_user');
    return saved ? JSON.parse(saved) : null;
  });

  const saveAccounts = (list) => {
    setAccounts(list);
    localStorage.setItem('cgkc_accounts', JSON.stringify(list));
  };

  // Đăng nhập — chặn nếu bị ban
  const login = (username, password) => {
    const account = accounts.find(a => a.username === username && a.password === password);
    if (account) {
      if (account.banned) return { success: false, message: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.' };
      const userData = { username: account.username, role: account.role, name: account.name, phone: account.phone || '' };
      setUser(userData);
      localStorage.setItem('restaurant_user', JSON.stringify(userData));
      return { success: true, role: account.role };
    }
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
  };

  // Đăng ký — mặc định role customer
  const register = ({ name, username, password, phone }) => {
    if (accounts.find(a => a.username === username)) {
      return { success: false, message: 'Tên đăng nhập đã tồn tại' };
    }
    const newAccount = { username, password, role: 'customer', name, phone: phone || '', banned: false };
    saveAccounts([...accounts, newAccount]);
    const userData = { username, role: 'customer', name, phone: phone || '' };
    setUser(userData);
    localStorage.setItem('restaurant_user', JSON.stringify(userData));
    return { success: true, role: 'customer' };
  };

  // Đổi mật khẩu (user tự đổi)
  const changePassword = (oldPassword, newPassword) => {
    const account = accounts.find(a => a.username === user?.username);
    if (!account || account.password !== oldPassword) {
      return { success: false, message: 'Mật khẩu hiện tại không đúng' };
    }
    saveAccounts(accounts.map(a => a.username === user.username ? { ...a, password: newPassword } : a));
    return { success: true };
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem('restaurant_user');
  };

  // ── Admin functions ──────────────────────────────────────

  const getAllAccounts = () => accounts;

  // Cập nhật thông tin (tên, role, phone...)
  const updateAccount = (username, changes) => {
    saveAccounts(accounts.map(a => a.username === username ? { ...a, ...changes } : a));
  };

  // Xóa tài khoản
  const deleteAccount = (username) => {
    saveAccounts(accounts.filter(a => a.username !== username));
  };

  // Ban / Unban tài khoản
  const banAccount = (username) => {
    saveAccounts(accounts.map(a => a.username === username ? { ...a, banned: !a.banned } : a));
  };

  // Reset mật khẩu về mặc định
  const resetPassword = (username) => {
    saveAccounts(accounts.map(a => a.username === username ? { ...a, password: '123456' } : a));
  };

  // Đổi role
  const changeRole = (username, newRole) => {
    saveAccounts(accounts.map(a => a.username === username ? { ...a, role: newRole } : a));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login, logout, register, changePassword,
      getAllAccounts, updateAccount, deleteAccount,
      banAccount, resetPassword, changeRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
