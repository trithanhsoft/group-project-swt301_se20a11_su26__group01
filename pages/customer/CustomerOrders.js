import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerOrders.css';

const orderHistory = [
  {
    id: '#C047', date: '22/05/2026 18:32', status: 'serving',
    items: [
      { name: 'Bò Wagyu nướng than hoa', qty: 1, price: 580000 },
      { name: 'Rượu vang đỏ Pháp', qty: 1, price: 280000 },
    ],
    total: 903000,
  },
  {
    id: '#C046', date: '20/05/2026 12:10', status: 'done',
    items: [
      { name: 'Cá hồi áp chảo sốt chanh', qty: 2, price: 320000 },
      { name: 'Cocktail Signature', qty: 2, price: 145000 },
    ],
    total: 966000,
  },
  {
    id: '#C045', date: '18/05/2026 19:00', status: 'done',
    items: [
      { name: 'Tôm hùm hấp bia', qty: 1, price: 750000 },
      { name: 'Bánh soufflé socola', qty: 2, price: 125000 },
    ],
    total: 1050000,
  },
];

const statusMap = {
  pending: { label: 'Chờ xác nhận', cls: 'status-pending', icon: '⏳' },
  serving: { label: 'Đang phục vụ', cls: 'status-serving', icon: '🍽️' },
  done:    { label: 'Hoàn thành',   cls: 'status-done',    icon: '✅' },
};

function CustomerOrders() {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="cust-orders">
      <h1 className="page-title">Lịch sử đơn hàng</h1>

      {orderHistory.length === 0 ? (
        <div className="no-orders">
          <div style={{fontSize:48, marginBottom:12}}>📋</div>
          <p>Bạn chưa có đơn hàng nào</p>
          <button className="btn-primary" onClick={() => navigate('/customer/menu')}
            style={{marginTop:16}}>Xem thực đơn</button>
        </div>
      ) : (
        <div className="orders-list">
          {orderHistory.map(order => (
            <div key={order.id} className="cust-order-card card">
              <div className="cust-order-header"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div>
                  <span className="cust-order-id">{order.id}</span>
                  <span className="cust-order-date">{order.date}</span>
                </div>
                <div className="cust-order-right">
                  <span className={`status-badge ${statusMap[order.status].cls}`}>
                    {statusMap[order.status].icon} {statusMap[order.status].label}
                  </span>
                  <span className="cust-order-total">{order.total.toLocaleString('vi-VN')}đ</span>
                  <span className="expand-icon">{expanded === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === order.id && (
                <div className="cust-order-detail">
                  <div className="order-items-list">
                    {order.items.map((item, i) => (
                      <div key={i} className="order-item-row">
                        <span>{item.name} × {item.qty}</span>
                        <span>{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                    <div className="order-item-row order-total-row">
                      <span>Tổng cộng</span>
                      <strong>{order.total.toLocaleString('vi-VN')}đ</strong>
                    </div>
                  </div>

                  {order.status === 'done' && (
                    <button className="review-btn"
                      onClick={() => navigate('/customer/feedback')}>
                      ⭐ Đánh giá đơn hàng
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerOrders;
