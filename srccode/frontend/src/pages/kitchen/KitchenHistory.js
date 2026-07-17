import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import './KitchenHistory.css';

function KitchenHistory() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all'); // all | READY | COMPLETED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKitchenHistory();
  }, []);

  const getApiMessage = (data, fallback) => {
    if (!data) return fallback;

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object') {
      return data.message || data.error || data.detail || fallback;
    }

    return fallback;
  };

  const fetchKitchenHistory = async () => {
    setLoading(true);
    setError('');

    try {
      const [readyRes, completedRes] = await Promise.all([
        API.get('/orders/status/READY'),
        API.get('/orders/status/COMPLETED')
      ]);

      const readyOrders = readyRes.data || [];
      const completedOrders = completedRes.data || [];

      const mergedHistory = [...readyOrders, ...completedOrders].sort((a, b) => {
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });

      setHistory(mergedHistory);
    } catch (error) {
      console.error('Fetch kitchen history error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tải lịch sử bếp'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString('vi-VN');
  };

  const getCompletedTime = (order) => {
    return formatDateTime(order.updatedAt || order.createdAt);
  };

  const getStatusLabel = (status) => {
    if (status === 'READY') {
      return {
        label: 'Sẵn sàng phục vụ',
        icon: '🍽️',
        cls: 'history-ready'
      };
    }

    if (status === 'COMPLETED') {
      return {
        label: 'Hoàn thành',
        icon: '✅',
        cls: 'history-completed'
      };
    }

    return {
      label: status || 'Không xác định',
      icon: 'ℹ️',
      cls: ''
    };
  };

  const getCustomerDisplay = (order) => {
    return order.customerName || order.username || 'Khách vãng lai';
  };

  const getTableDisplay = (order) => {
    return order.tableName || (order.tableId ? `Bàn ${order.tableId}` : 'Không có bàn');
  };

  const filteredHistory =
    filter === 'all'
      ? history
      : history.filter((order) => order.status === filter);

  if (loading) {
    return (
      <div className="kitchen-history">
        <h1 className="kitchen-history-title">Lịch sử bếp</h1>

        <div className="history-card" style={{ textAlign: 'center' }}>
          ⏳ Đang tải lịch sử bếp...
        </div>
      </div>
    );
  }

  return (
    <div className="kitchen-history">
      <div className="kitchen-history-header">
        <h1 className="kitchen-history-title">Lịch sử bếp</h1>

        <button className="history-refresh-btn" onClick={fetchKitchenHistory}>
          🔄 Làm mới
        </button>
      </div>

      <div className="history-filters">
        {[
          ['all', 'Tất cả'],
          ['READY', 'Sẵn sàng phục vụ'],
          ['COMPLETED', 'Hoàn thành']
        ].map(([value, label]) => (
          <button
            key={value}
            className={`history-filter-btn ${filter === value ? 'active' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="history-card" style={{ color: '#dc2626' }}>
          ⚠️ {error}
        </div>
      )}

      {filteredHistory.length === 0 ? (
        <div className="history-card" style={{ textAlign: 'center' }}>
          🎉 Chưa có đơn nào trong lịch sử bếp
        </div>
      ) : (
        <div className="history-list">
          {filteredHistory.map((order) => {
            const statusInfo = getStatusLabel(order.status);

            return (
              <div key={order.orderId} className="history-card">
                <div className="history-header">
                  <span className="history-id">
                    {order.orderCode || `#${order.orderId}`}
                  </span>

                  <span className="history-table">
                    🪑 {getTableDisplay(order)}
                  </span>

                  <span className="history-table">
                    👤 {getCustomerDisplay(order)}
                  </span>

                  {order.customerPhone && (
                    <span className="history-table">
                      📞 {order.customerPhone}
                    </span>
                  )}

                  <span className="history-time">
                    {statusInfo.icon} {getCompletedTime(order)}
                  </span>

                  <span className={`history-status ${statusInfo.cls}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className="history-items">
                  {order.items?.map((item) => (
                    <span key={item.orderItemId} className="history-tag">
                      {item.emoji ? `${item.emoji} ` : ''}
                      {item.foodName} × {item.quantity}
                    </span>
                  ))}
                </div>

                <div className="history-note">
                  💰 Tổng tiền: <strong>{formatMoney(order.totalAmount)}đ</strong>
                </div>

                {order.note && (
                  <div className="history-note">
                    📝 {order.note}
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

export default KitchenHistory;