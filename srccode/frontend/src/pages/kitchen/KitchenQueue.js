import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import './KitchenQueue.css';

const statusMap = {
  CONFIRMED: {
    label: 'Chờ nấu',
    cls: 'item-pending',
    next: 'PREPARING',
    action: '🔥 Bắt đầu nấu'
  },
  PREPARING: {
    label: 'Đang nấu',
    cls: 'item-cooking',
    next: 'READY',
    action: '✅ Sẵn sàng'
  }
};

function elapsed(createdAt) {
  if (!createdAt) return '';

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return '';
  }

  const mins = Math.floor((Date.now() - createdDate.getTime()) / 60000);

  if (mins < 1) return '< 1 phút';

  return `${mins} phút`;
}

function urgencyClass(createdAt) {
  if (!createdAt) return '';

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return '';
  }

  const mins = Math.floor((Date.now() - createdDate.getTime()) / 60000);

  if (mins >= 20) return 'urgent-high';
  if (mins >= 10) return 'urgent-med';

  return '';
}

function KitchenQueue() {
  const [queue, setQueue] = useState([]);
  const [completedToday, setCompletedToday] = useState([]);
  const [clock, setClock] = useState(new Date());
  const [filter, setFilter] = useState('all'); // all | CONFIRMED | PREPARING
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKitchenOrders();

    const timer = setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => clearInterval(timer);
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

  const fetchKitchenOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const [confirmedRes, preparingRes] = await Promise.all([
        API.get('/orders/status/CONFIRMED'),
        API.get('/orders/status/PREPARING')
      ]);

      const confirmedOrders = confirmedRes.data || [];
      const preparingOrders = preparingRes.data || [];

      const mergedOrders = [...confirmedOrders, ...preparingOrders].sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      setQueue(mergedOrders);
    } catch (error) {
      console.error('Fetch kitchen orders error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tải hàng đợi bếp'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (order, nextStatus) => {
    setActionLoadingId(order.orderId);
    setError('');

    try {
      const response = await API.put(`/orders/${order.orderId}/status`, {
        status: nextStatus
      });

      if (nextStatus === 'READY') {
        setCompletedToday((prev) => [
          {
            ...response.data,
            completedAt: new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            })
          },
          ...prev
        ]);

        setQueue((prev) =>
          prev.filter((item) => item.orderId !== order.orderId)
        );
      } else {
        setQueue((prev) =>
          prev.map((item) =>
            item.orderId === order.orderId ? response.data : item
          )
        );
      }
    } catch (error) {
      console.error('Update kitchen order error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể cập nhật trạng thái đơn'
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatTime = (value) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString('vi-VN');
  };

  const getOrderStatusInfo = (status) => {
    return (
      statusMap[status] || {
        label: status || 'Không xác định',
        cls: 'item-pending',
        next: null,
        action: ''
      }
    );
  };

  const getCustomerDisplay = (order) => {
    return order.customerName || order.username || 'Khách vãng lai';
  };

  const getTableDisplay = (order) => {
    return order.tableName || (order.tableId ? `Bàn ${order.tableId}` : 'Không có bàn');
  };

  const filteredQueue = queue.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const confirmedCount = queue.filter((order) => order.status === 'CONFIRMED').length;
  const preparingCount = queue.filter((order) => order.status === 'PREPARING').length;

  if (loading) {
    return (
      <div className="kitchen-queue">
        <div className="kitchen-topbar">
          <div className="kitchen-clock">
            🕐 {clock.toLocaleTimeString('vi-VN')}
          </div>
        </div>

        <div className="kitchen-empty">
          <p>⏳ Đang tải hàng đợi bếp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kitchen-queue">
      <div className="kitchen-topbar">
        <div className="kitchen-clock">
          🕐 {clock.toLocaleTimeString('vi-VN')}
        </div>

        <div className="kitchen-summary">
          <span className="ks-badge ks-total">{queue.length} đơn</span>
          <span className="ks-badge ks-pending">⏳ {confirmedCount} chờ nấu</span>
          <span className="ks-badge ks-cooking">🔥 {preparingCount} đang nấu</span>
          <span className="ks-badge ks-done">✅ {completedToday.length} sẵn sàng</span>

          <button
            className="kfilter-btn"
            onClick={fetchKitchenOrders}
            style={{ marginLeft: 8 }}
          >
            🔄 Làm mới
          </button>
        </div>
      </div>

      <div className="kitchen-filters">
        {[
          ['all', 'Tất cả'],
          ['CONFIRMED', 'Chờ nấu'],
          ['PREPARING', 'Đang nấu']
        ].map(([value, label]) => (
          <button
            key={value}
            className={`kfilter-btn ${filter === value ? 'active' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="kitchen-empty" style={{ color: '#dc2626' }}>
          <p>⚠️ {error}</p>
        </div>
      )}

      <div className="kitchen-cards">
        {filteredQueue.length === 0 && (
          <div className="kitchen-empty">
            <p>🎉 Không có đơn nào đang chờ bếp</p>
          </div>
        )}

        {filteredQueue.map((order) => {
          const urgent = urgencyClass(order.createdAt);
          const statusInfo = getOrderStatusInfo(order.status);
          const isActionLoading = actionLoadingId === order.orderId;

          return (
            <div
              key={order.orderId}
              className={`kitchen-card ${urgent}`}
            >
              <div className="kcard-header">
                <div className="kcard-left">
                  <span className="kcard-id">
                    {order.orderCode || `#${order.orderId}`}
                  </span>

                  <span className="kcard-table">
                    🪑 {getTableDisplay(order)}
                  </span>

                  <span className="kcard-table">
                    👤 {getCustomerDisplay(order)}
                  </span>

                  {order.customerPhone && (
                    <span className="kcard-table">
                      📞 {order.customerPhone}
                    </span>
                  )}
                </div>

                <div className="kcard-right">
                  <span className="kcard-time">
                    ⏱ {formatTime(order.createdAt)}
                  </span>

                  <span className={`kcard-elapsed ${urgent}`}>
                    {elapsed(order.createdAt)}
                    {urgent === 'urgent-high' && ' ⚠️'}
                  </span>
                </div>
              </div>

              <div className="kcard-items">
                {order.items?.map((item) => (
                  <div
                    key={item.orderItemId}
                    className={`kcard-item ${statusInfo.cls}`}
                  >
                    <div className="kitem-info">
                      <span className="kitem-name">
                        {item.emoji ? `${item.emoji} ` : ''}
                        {item.foodName}
                      </span>

                      <span className="kitem-qty">× {item.quantity}</span>
                    </div>

                    <div className="kitem-right">
                      <span className="kitem-status-label">
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {order.note && (
                <div className="kcard-progress">
                  <span className="kprog-text">📝 {order.note}</span>
                </div>
              )}

              <div className="kcard-progress">
                <div className="kprog-bar">
                  <div
                    className="kprog-fill"
                    style={{
                      width: order.status === 'PREPARING' ? '60%' : '20%'
                    }}
                  ></div>
                </div>

                <span className="kprog-text">
                  Tổng tiền: {formatMoney(order.totalAmount)}đ
                </span>
              </div>

              <div className="kcard-ready">
                <span>
                  {order.status === 'CONFIRMED'
                    ? '⏳ Đơn đã xác nhận, chờ bếp bắt đầu'
                    : '🔥 Đơn đang được chế biến'}
                </span>

                {statusInfo.next && (
                  <button
                    className="kcard-serve-btn"
                    disabled={isActionLoading}
                    onClick={() => updateOrderStatus(order, statusInfo.next)}
                  >
                    {isActionLoading ? 'Đang xử lý...' : statusInfo.action}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completedToday.length > 0 && (
        <div className="kitchen-done-section">
          <h3 className="done-title">
            ✅ Đã sẵn sàng hôm nay ({completedToday.length})
          </h3>

          <div className="done-list">
            {completedToday.map((order) => (
              <div key={order.orderId} className="done-card">
                <span className="done-id">
                  {order.orderCode || `#${order.orderId}`}
                </span>

                <span className="done-table">
                  🪑 {getTableDisplay(order)}
                </span>

                <span className="done-table">
                  👤 {getCustomerDisplay(order)}
                </span>

                <span className="done-items">
                  {order.items?.length || 0} món
                </span>

                <span className="done-time">
                  ✅ {order.completedAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default KitchenQueue;