import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AIChatbot from '../components/AIChatbot';
import LiveChat from '../components/LiveChat';
import './CustomerLayout.css';

function CustomerLayout() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="customer-layout">
      <header className="customer-header">
        <div className="customer-brand" onClick={() => navigate('/customer/menu')}>
          🍜 <span>Cái Gì Cũng Không Có</span>
        </div>

        <nav className="customer-nav">
          <NavLink to="/customer/menu"        className={({ isActive }) => isActive ? 'active' : ''}>Thực đơn</NavLink>
          <NavLink to="/customer/reservation" className={({ isActive }) => isActive ? 'active' : ''}>Đặt bàn</NavLink>
          <NavLink to="/customer/orders"      className={({ isActive }) => isActive ? 'active' : ''}>Đơn hàng</NavLink>
        </nav>

        <div className="customer-actions">
          <NavLink to="/customer/cart" className="cart-btn">
            🛒 <span className="cart-count">{totalItems}</span>
          </NavLink>
          <div className="cust-user" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="cust-avatar">{user?.name?.charAt(0)}</div>
            <span>{user?.name}</span>
          </div>
          {menuOpen && (
            <div className="cust-dropdown">
              <button onClick={() => { navigate('/customer/profile'); setMenuOpen(false); }}>👤 Hồ sơ của tôi</button>
              <button onClick={() => { logout(); navigate('/login'); }}>🚪 Đăng xuất</button>
            </div>
          )}
        </div>
      </header>

      <main className="customer-main">
        <Outlet />
      </main>
      {/* <AIChatbot /> */}
      <LiveChat />
    </div>
  );
}

export default CustomerLayout;
