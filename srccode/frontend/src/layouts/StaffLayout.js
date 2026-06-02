import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './StaffLayout.css';

const navItems = [
  { path: '/staff/tables',       icon: '🪑', label: 'Quản lý bàn' },
  { path: '/staff/reservations', icon: '📅', label: 'Đặt bàn trước' },
  { path: '/staff/orders',       icon: '📋', label: 'Đơn hàng' },
  { path: '/staff/customers',    icon: '👤', label: 'Khách hàng' },
];

function StaffLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="staff-layout">
      <aside className="staff-sidebar">
        <div className="staff-logo">🍜 <span>Staff Panel</span></div>
        <nav className="staff-nav">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) => `staff-nav-item ${isActive ? 'active' : ''}`}>
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="staff-footer">
          <div className="staff-user">
            <div className="staff-avatar">{user?.name?.charAt(0)}</div>
            <div>
              <p className="staff-name">{user?.name}</p>
              <p className="staff-role-label">Nhân viên</p>
            </div>
          </div>
          <button className="staff-logout" onClick={handleLogout}>🚪</button>
        </div>
      </aside>
      <main className="staff-main">
        <Outlet />
      </main>
    </div>
  );
}

export default StaffLayout;
