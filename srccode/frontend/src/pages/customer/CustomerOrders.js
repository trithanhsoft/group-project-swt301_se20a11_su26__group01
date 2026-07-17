import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './CustomerOrders.css';

const getSimpleStatus = (status) => {
  if (status === 'COMPLETED') return 'done';
  if (status === 'CANCELLED') return 'cancelled';
  return 'pending';
};

const simpleStatusMap = {
  pending:   { label: 'Đang xử lý', cls: 'status-pending',   icon: '⏳' },
  done:      { label: 'Hoàn thành',  cls: 'status-done',      icon: '✅' },
  cancelled: { label: 'Đã hủy',     cls: 'status-cancelled', icon: '❌' },
};

function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();

  const getApiMessage = (data, fallback) => {
    if (!data) return fallback;
    if (typeof data === 'string') return data;
    if (typeof data === 'object') return data.message || data.error || data.detail || fallback;
    return fallback;
  };

  const fetchCustomerOrders = useCallback(async () => {
    if (!user?.userId) { setLoading(false); setError('Bạn cần đăng nhập để xem đơn hàng'); return; }
    setError('');
    try {
      const response = await API.get(`/orders/customer/${user.userId}`);
      setOrders(response.data || []);
    } catch (err) {
      setError(getApiMessage(err.response?.data, 'Không thể tải danh sách đơn hàng'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCustomerOrders(); }, [fetchCustomerOrders]);

  // Polling mỗi 5 giây — cập nhật khi staff thay đổi trạng thái
  useEffect(() => {
    if (!user?.userId) return;
    const interval = setInterval(() => {
      API.get(`/orders/customer/${user.userId}`)
        .then(res => setOrders(res.data || []))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const formatDateTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN');

  if (loading) {
    return (
      <div className="cust-orders">
        <h1 className="page-title">Lịch sử đơn hàng</h1>
        <div className="no-orders">
          <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
          <p>Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cust-orders">
        <h1 className="page-title">Lịch sử đơn hàng</h1>
        <div className="no-orders">
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchCustomerOrders} style={{ marginTop: 16 }}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cust-orders">
      <h1 className="page-title">Lịch sử đơn hàng</h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <p>Bạn chưa có đơn hàng nào</p>
          <button className="btn-primary" onClick={() => navigate('/customer/menu')} style={{ marginTop: 16 }}>
            Xem thực đơn
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const simple = getSimpleStatus(order.status);
            const statusInfo = simpleStatusMap[simple];

            return (
              <div key={order.orderId} className="cust-order-card card">
                <div className="cust-order-header"
                  onClick={() => setExpanded(expanded === order.orderId ? null : order.orderId)}>
                  <div>
                    <span className="cust-order-id">{order.orderCode || `#${order.orderId}`}</span>
                    <span className="cust-order-date">{formatDateTime(order.createdAt)}</span>
                  </div>
                  <div className="cust-order-right">
                    <span className={`status-badge ${statusInfo.cls}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                    <span className="cust-order-total">{formatMoney(order.totalAmount)}đ</span>
                    <span className="expand-icon">{expanded === order.orderId ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expanded === order.orderId && (
                  <div className="cust-order-detail">
                    <div className="order-items-list">
                      {order.items?.map((item) => (
                        <div key={item.orderItemId} className="order-item-row">
                          <span>{item.emoji ? `${item.emoji} ` : ''}{item.foodName} × {item.quantity}</span>
                          <span>{formatMoney(item.subtotal)}đ</span>
                        </div>
                      ))}
                      {order.note && (
                        <div className="order-item-row">
                          <span>📝 Ghi chú</span><span>{order.note}</span>
                        </div>
                      )}
                      <div className="order-item-row order-total-row">
                        <span>Tổng cộng</span>
                        <strong>{formatMoney(order.totalAmount)}đ</strong>
                      </div>
                    </div>

                    {order.status === 'COMPLETED' && (
                      <button className="review-btn" onClick={() => navigate('/customer/feedback')}>
                        ⭐ Đánh giá đơn hàng
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CustomerOrders;
