import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <button className="toggle-btn" onClick={onToggleSidebar}>
        ☰
      </button>

      <div className="header-right">
        <div className="header-date">
          {new Date().toLocaleDateString('vi-VN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </div>

        <div className="header-notif">
          🔔
          <span className="notif-badge">3</span>
        </div>

        <div className="header-user">
          <div className="user-avatar">{user?.name?.charAt(0) || 'A'}</div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">Quản lý</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
          🚪
        </button>
      </div>
    </header>
  );
}

export default Header;

