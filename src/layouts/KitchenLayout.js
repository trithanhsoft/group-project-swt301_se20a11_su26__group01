import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './KitchenLayout.css';

function KitchenLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="kitchen-layout">
      <header className="kitchen-header">
        <div className="kitchen-brand">🍳 Kitchen Display</div>
        <nav className="kitchen-nav">
          <NavLink to="/kitchen/queue" className={({ isActive }) => isActive ? 'active' : ''}>
            📋 Hàng chờ
          </NavLink>
          <NavLink to="/kitchen/history" className={({ isActive }) => isActive ? 'active' : ''}>
            ✅ Hoàn thành
          </NavLink>
        </nav>
        <div className="kitchen-user">
          <span>👤 {user?.name}</span>
          <button onClick={() => { logout(); navigate('/login'); }}>🚪 Đăng xuất</button>
        </div>
      </header>
      <main className="kitchen-main">
        <Outlet />
      </main>
    </div>
  );
}

export default KitchenLayout;
