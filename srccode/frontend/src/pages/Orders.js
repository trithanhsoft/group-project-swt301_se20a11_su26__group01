import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './Orders.css';

const statusMap = {
  PENDING: {
    label: 'Chờ xác nhận',
    cls: 'status-pending'
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    cls: 'status-serving'
  },
  PREPARING: {
    label: 'Đang chế biến',
    cls: 'status-serving'
  },
  READY: {
    label: 'Sẵn sàng',
    cls: 'status-ready'
  },
  COMPLETED: {
    label: 'Hoàn thành',
    cls: 'status-done'
  },
  CANCELLED: {
    label: 'Đã huỷ',
    cls: 'status-cancelled'
  }
};

const filterOptions = [
  ['all', 'Tất cả'],
  ['PENDING', 'Chờ xác nhận'],
  ['CONFIRMED', 'Đã xác nhận'],
  ['PREPARING', 'Đang chế biến'],
  ['READY', 'Sẵn sàng'],
  ['COMPLETED', 'Hoàn thành'],
  ['CANCELLED', 'Đã huỷ']
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('orders');
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
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

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get('/orders');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Fetch admin orders error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tải danh sách đơn hàng'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderItems = (order) => {
    return order.items || order.orderItems || [];
  };

  const getItemLabel = (item) => {
    const name = item.foodName || item.name || 'Món ăn';
    const quantity = item.quantity || 0;

    return `${name} x${quantity}`;
  };

  const getItemCount = (order) => {
    return getOrderItems(order).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
  };

  const getCustomerName = (order) => {
    return (
      order.customerName ||
      order.userName ||
      order.username ||
      'Khách vãng lai'
    );
  };

  const getStatusInfo = (status) => {
    return (
      statusMap[status] || {
        label: status || 'Không xác định',
        cls: 'status-pending'
      }
    );
  };

  const filteredOrders = orders.filter((order) => {
    const keyword = search.trim().toLowerCase();

    const matchStatus =
      filter === 'all' ||
      order.status === filter;

    const matchSearch =
      !keyword ||
      String(order.orderCode || '').toLowerCase().includes(keyword) ||
      String(order.orderId || '').toLowerCase().includes(keyword) ||
      String(order.tableName || '').toLowerCase().includes(keyword) ||
      String(order.customerName || '').toLowerCase().includes(keyword) ||
      String(order.customerPhone || '').toLowerCase().includes(keyword);

    return matchStatus && matchSearch;
  });

  const completedOrders = orders.filter(order => order.status === 'COMPLETED');
  const cancelledOrders = orders.filter(order => order.status === 'CANCELLED');

  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const totalOrders = orders.length;
  const doneOrders = completedOrders.length;
  const cancelOrders = cancelledOrders.length;
  const avgOrder = doneOrders > 0 ? Math.round(totalRevenue / doneOrders) : 0;

  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
  const activeOrders = orders.filter(order =>
    ['CONFIRMED', 'PREPARING', 'READY'].includes(order.status)
  ).length;

  if (loading) {
    return (
      <div className="orders-page">
        <h1 className="page-title">Đơn hàng</h1>

        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          ⏳ Đang tải danh sách đơn hàng...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="page-header">
          <h1 className="page-title">Đơn hàng</h1>

          <button className="btn-primary" onClick={fetchOrders}>
            🔄 Thử lại
          </button>
        </div>

        <div className="card" style={{ padding: 24, color: '#dc2626' }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">Đơn hàng</h1>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`tab-btn ${tab === 'orders' ? 'active' : ''}`}
            onClick={() => setTab('orders')}
          >
            📋 Danh sách
          </button>

          <button
            className={`tab-btn ${tab === 'report' ? 'active' : ''}`}
            onClick={() => setTab('report')}
          >
            📊 Báo cáo
          </button>

          <button className="btn-primary" onClick={fetchOrders}>
            🔄 Làm mới
          </button>
        </div>
      </div>

      {tab === 'report' && (
        <div className="order-report">
          <div className="report-stats-grid">
            <div className="card rstat">
              <p className="rstat-label">Tổng doanh thu</p>
              <h3 className="rstat-val">{formatMoney(totalRevenue)}</h3>
            </div>

            <div className="card rstat">
              <p className="rstat-label">Tổng đơn</p>
              <h3 className="rstat-val">{totalOrders}</h3>
            </div>

            <div className="card rstat">
              <p className="rstat-label">Chờ xác nhận</p>
              <h3 className="rstat-val" style={{ color: '#d69e2e' }}>
                {pendingOrders}
              </h3>
            </div>

            <div className="card rstat">
              <p className="rstat-label">Đang xử lý</p>
              <h3 className="rstat-val" style={{ color: '#3182ce' }}>
                {activeOrders}
              </h3>
            </div>

            <div className="card rstat">
              <p className="rstat-label">Hoàn thành</p>
              <h3 className="rstat-val" style={{ color: '#38a169' }}>
                {doneOrders}
              </h3>
            </div>

            <div className="card rstat">
              <p className="rstat-label">Đã hủy</p>
              <h3 className="rstat-val" style={{ color: '#e53e3e' }}>
                {cancelOrders}
              </h3>
            </div>

            <div className="card rstat">
              <p className="rstat-label">TB / đơn</p>
              <h3 className="rstat-val">{formatMoney(avgOrder)}</h3>
            </div>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
              📊 Thống kê theo trạng thái
            </h3>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Trạng thái</th>
                  <th>Số đơn</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>

              <tbody>
                {filterOptions
                  .filter(([value]) => value !== 'all')
                  .map(([status]) => {
                    const statusOrders = orders.filter(order => order.status === status);
                    const statusTotal = statusOrders.reduce(
                      (sum, order) => sum + Number(order.totalAmount || 0),
                      0
                    );
                    const statusInfo = getStatusInfo(status);

                    return (
                      <tr key={status}>
                        <td>
                          <span className={`status-badge ${statusInfo.cls}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td>{statusOrders.length} đơn</td>
                        <td style={{ color: '#e85d04', fontWeight: 700 }}>
                          {formatMoney(statusTotal)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <>
          <div className="order-toolbar">
            <input
              className="search-input"
              placeholder="🔍 Tìm mã đơn, bàn, khách, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs" style={{ marginBottom: 16 }}>
            {filterOptions.map(([value, label]) => (
              <button
                key={value}
                className={`filter-tab ${filter === value ? 'active' : ''}`}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="card" style={{ padding: 24, textAlign: 'center' }}>
              Không có đơn hàng nào phù hợp.
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map(order => {
                const statusInfo = getStatusInfo(order.status);
                const items = getOrderItems(order);
                const isExpanded = expanded === order.orderId;

                return (
                  <div key={order.orderId} className="order-row card">
                    <div className="order-col order-id-col">
                      <span className="order-id">
                        {order.orderCode || `#${order.orderId}`}
                      </span>

                      <span className="order-time">
                        {formatTime(order.createdAt)}
                      </span>

                      <span style={{ fontSize: 11, color: '#a0aec0' }}>
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="order-col">
                      <span className="order-table">
                        🪑 {order.tableName || 'Không có bàn'}
                      </span>

                      <span className="order-waiter">
                        👤 {getCustomerName(order)}
                      </span>

                      {order.customerPhone && (
                        <span className="order-waiter">
                          📞 {order.customerPhone}
                        </span>
                      )}
                    </div>

                    <div className="order-col order-items-col">
                      {items.slice(0, isExpanded ? items.length : 2).map((item, index) => (
                        <span key={index} className="order-item-tag">
                          {getItemLabel(item)}
                        </span>
                      ))}

                      {!isExpanded && items.length > 2 && (
                        <span className="order-item-tag">
                          +{items.length - 2} món khác
                        </span>
                      )}

                      {items.length === 0 && (
                        <span className="order-item-tag">
                          {getItemCount(order)} món
                        </span>
                      )}

                      {isExpanded && order.note && (
                        <span className="order-note">
                          📝 {order.note}
                        </span>
                      )}
                    </div>

                    <div className="order-col">
                      <span className="order-total">
                        {formatMoney(order.totalAmount)}
                      </span>
                    </div>

                    <div className="order-col">
                      <span className={`status-badge ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="order-col order-actions">
                      <button
                        className="action-btn"
                        title="Xem chi tiết"
                        onClick={() =>
                          setExpanded(isExpanded ? null : order.orderId)
                        }
                      >
                        {isExpanded ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Orders;