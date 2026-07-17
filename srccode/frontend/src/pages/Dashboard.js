import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import API from '../services/api';
import './Dashboard.css';

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
    label: 'Sẵn sàng phục vụ',
    cls: 'status-serving'
  },
  COMPLETED: {
    label: 'Hoàn thành',
    cls: 'status-done'
  },
  CANCELLED: {
    label: 'Đã hủy',
    cls: 'status-pending'
  }
};

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stat-card card">
      <div className="stat-icon" style={{ background: color }}>{icon}</div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value}</h3>
        <p className="stat-sub">{sub}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
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

  const fetchSummary = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get('/dashboard/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Fetch dashboard summary error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tải dữ liệu dashboard'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
  };

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString('vi-VN');
  };

  const getStatusInfo = (status) => {
    return (
      statusMap[status] || {
        label: status || 'Không xác định',
        cls: 'status-pending'
      }
    );
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="page-title">Dashboard</h1>

        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          ⏳ Đang tải dữ liệu dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>

          <button className="btn-primary" onClick={fetchSummary}>
            🔄 Thử lại
          </button>
        </div>

        <div className="card" style={{ padding: 24, color: '#dc2626' }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  const revenueData = summary?.revenueByDays || [];
  const topDishes = summary?.topFoods || [];
  const recentOrders = summary?.recentOrders || [];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>

        <button className="btn-primary" onClick={fetchSummary}>
          🔄 Làm mới
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="💰"
          label="Doanh thu hôm nay"
          value={formatMoney(summary?.todayRevenue)}
          sub={`Tổng doanh thu: ${formatMoney(summary?.totalRevenue)}`}
          color="#fff0e6"
        />

        <StatCard
          icon="📋"
          label="Đơn hàng hôm nay"
          value={formatNumber(summary?.todayOrders)}
          sub="Tính theo đơn được tạo trong ngày"
          color="#e6f4ff"
        />

        <StatCard
          icon="🪑"
          label="Bàn đang phục vụ"
          value={`${formatNumber(summary?.occupiedTables)} / ${formatNumber(summary?.totalTables)}`}
          sub={`${formatNumber(summary?.availableTables)} bàn còn trống`}
          color="#e6fff0"
        />

        <StatCard
          icon="👥"
          label="Khách hôm nay"
          value={formatNumber(summary?.todayCustomers)}
          sub="Ước tính theo số đơn trong ngày"
          color="#fff6e6"
        />
      </div>

      <div className="charts-row">
        <div className="card chart-card">
          <h2 className="chart-title">Doanh thu 7 ngày qua</h2>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e85d04" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#e85d04" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

              <XAxis dataKey="day" tick={{ fontSize: 12 }} />

              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(Number(value) / 1000000).toFixed(1)}M`}
              />

              <Tooltip formatter={(value) => formatMoney(value)} />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#e85d04"
                fill="url(#colorRev)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h2 className="chart-title">Món bán chạy</h2>

          {topDishes.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#777' }}>
              Chưa có dữ liệu món bán chạy
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topDishes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                <XAxis type="number" tick={{ fontSize: 12 }} />

                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={90}
                />

                <Tooltip />

                <Bar
                  dataKey="orders"
                  fill="#e85d04"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="chart-title">Đơn hàng gần đây</h2>

        {recentOrders.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#777' }}>
            Chưa có đơn hàng nào
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Bàn</th>
                <th>Số món</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);

                return (
                  <tr key={order.orderId}>
                    <td className="order-id">
                      {order.orderCode || `#${order.orderId}`}
                    </td>

                    <td>{order.tableName || 'Không có bàn'}</td>

                    <td>{order.items || 0} món</td>

                    <td className="order-total">
                      {formatMoney(order.totalAmount)}
                    </td>

                    <td>
                      <span className={`status-badge ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;