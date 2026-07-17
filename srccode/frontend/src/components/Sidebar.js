  import React from 'react';
  import { NavLink } from 'react-router-dom';
  import './Sidebar.css';

  const navItems = [
    { path: '/admin/dashboard',    icon: '📊', label: 'Dashboard' },
    { path: '/admin/tables',       icon: '🪑', label: 'Quản lý bàn' },
    { path: '/admin/menu',         icon: '🍽️', label: 'Thực đơn' },
    { path: '/admin/orders',       icon: '📋', label: 'Đơn hàng' },
    { path: '/admin/reservations', icon: '📅', label: 'Đặt bàn' },
    { path: '/admin/reports',      icon: '📈', label: 'Báo cáo' },
    { path: '/admin/feedback',     icon: '💬', label: 'Phản hồi' },
    { path: '/admin/accounts',     icon: '🔐', label: 'Tài khoản' },
    { path: '/admin/vouchers',     icon: '🎁', label: 'Voucher' },
  ];

  function Sidebar({ isOpen }) {
    return (
      <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">🍜</span>
          {isOpen && <span className="logo-text">CGKC</span>}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {isOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item">
            <span className="nav-icon">⚙️</span>
            {isOpen && <span className="nav-label">Cài đặt</span>}
          </div>
        </div>
      </aside>
    );
  }

  export default Sidebar;
