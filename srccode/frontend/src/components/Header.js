import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Bạn có chắc muốn đăng xuất không?');

    if (!confirmLogout) {
      return;
    }

    logout();
    navigate('/login');
  };

  const displayName = user?.username || user?.name || 'User';
  const displayRole = user?.roleName || user?.role || 'CUSTOMER';

  return (
    <header className="header">
      <button className="toggle-btn" onClick={onToggleSidebar}>
        ☰
      </button>

      <div className="header-right">
        <div className="header-date">
          {new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        <div className="header-notif">
          🔔
          <span className="notif-badge">3</span>
        </div>

        <div className="header-user">
          <div className="user-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-role">{displayRole}</span>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Đăng xuất"
        >
          🚪
        </button>
      </div>
    </header>
  );
}

export default Header;