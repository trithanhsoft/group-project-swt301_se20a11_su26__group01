import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import API from '../services/api';
import './Reports.css';

const COLORS = ['#e85d04', '#3182ce', '#38a169', '#d69e2e', '#8b5cf6'];

function Reports() {
  const [period, setPeriod] = useState('week');

  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
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

  const fetchReports = async () => {
    setLoading(true);
    setError('');

    try {
      const [summaryRes, ordersRes, paymentsRes] = await Promise.all([
        API.get('/dashboard/summary'),
        API.get('/orders'),
        API.get('/payments')
      ]);

      setSummary(summaryRes.data || {});
      setOrders(ordersRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (error) {
      console.error('Fetch reports error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tải dữ liệu báo cáo'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
  };

  const formatShortMoney = (value) => {
    const number = Number(value || 0);

    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }

    if (number >= 1000) {
      return `${(number / 1000).toFixed(0)}K`;
    }

    return `${number}`;
  };

  const getOrderItems = (order) => {
    return order.items || order.orderItems || [];
  };

  const completedOrders = orders.filter(order => order.status === 'COMPLETED');
  const cancelledOrders = orders.filter(order => order.status === 'CANCELLED');

  const totalRevenue = Number(summary?.totalRevenue || 0);
  const todayRevenue = Number(summary?.todayRevenue || 0);
  const totalOrders = orders.length;
  const completedCount = completedOrders.length;
  const cancelledCount = cancelledOrders.length;

  const avgOrder =
    completedCount > 0
      ? Math.round(totalRevenue / completedCount)
      : 0;

  const revenueByDays = summary?.revenueByDays || [];
  const topDishes = summary?.topFoods || [];

  const paymentMethodData = (() => {
    const paidPayments = payments.filter(payment => payment.status === 'PAID');

    const cash = paidPayments.filter(payment => payment.method === 'CASH').length;
    const qr = paidPayments.filter(payment => payment.method === 'QR').length;

    return [
      { name: 'Tiền mặt', value: cash },
      { name: 'QR / PayOS', value: qr }
    ].filter(item => item.value > 0);
  })();

  const orderStatusData = [
    { name: 'Chờ xác nhận', value: orders.filter(o => o.status === 'PENDING').length },
    { name: 'Đã xác nhận', value: orders.filter(o => o.status === 'CONFIRMED').length },
    { name: 'Đang chế biến', value: orders.filter(o => o.status === 'PREPARING').length },
    { name: 'Sẵn sàng', value: orders.filter(o => o.status === 'READY').length },
    { name: 'Hoàn thành', value: completedCount },
    { name: 'Đã hủy', value: cancelledCount }
  ].filter(item => item.value > 0);

  const monthlyData = (() => {
    const monthMap = {};

    orders.forEach(order => {
      if (!order.createdAt) return;

      const date = new Date(order.createdAt);

      if (Number.isNaN(date.getTime())) return;

      const monthKey = `T${date.getMonth() + 1}`;

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          month: monthKey,
          revenue: 0,
          orders: 0
        };
      }

      monthMap[monthKey].orders += 1;

      if (order.status === 'COMPLETED') {
        monthMap[monthKey].revenue += Number(order.totalAmount || 0);
      }
    });

    return Object.values(monthMap);
  })();

  const chartData = period === 'week' ? revenueByDays : monthlyData;
  const xKey = period === 'week' ? 'day' : 'month';

  if (loading) {
    return (
      <div className="reports-page">
        <h1 className="page-title">Báo cáo & Thống kê</h1>

        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          ⏳ Đang tải dữ liệu báo cáo...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-page">
        <div className="page-header">
          <h1 className="page-title">Báo cáo & Thống kê</h1>

          <button className="btn-primary" onClick={fetchReports}>
            🔄 Thử lại
          </button>
        </div>

        <div className="card" style={{ padding: 32, color: '#dc2626' }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1 className="page-title">Báo cáo & Thống kê</h1>

        <div className="period-tabs">
          {[
            ['week', 'Tuần'],
            ['month', 'Tháng']
          ].map(([value, label]) => (
            <button
              key={value}
              className={`filter-tab ${period === value ? 'active' : ''}`}
              onClick={() => setPeriod(value)}
            >
              {label}
            </button>
          ))}

          <button className="btn-primary" onClick={fetchReports}>
            🔄 Làm mới
          </button>
        </div>
      </div>

      <div className="report-stats">
        <div className="card report-stat">
          <p className="stat-label">💰 Tổng doanh thu</p>
          <h2 className="report-value">
            {formatMoney(totalRevenue)}
          </h2>
          <p className="stat-sub">
            Từ các thanh toán đã hoàn tất
          </p>
        </div>

        <div className="card report-stat">
          <p className="stat-label">📅 Doanh thu hôm nay</p>
          <h2 className="report-value">
            {formatMoney(todayRevenue)}
          </h2>
          <p className="stat-sub">
            Tính theo thời gian thanh toán
          </p>
        </div>

        <div className="card report-stat">
          <p className="stat-label">📋 Tổng đơn hàng</p>
          <h2 className="report-value">
            {totalOrders.toLocaleString('vi-VN')}
          </h2>
          <p className="stat-sub">
            {completedCount} hoàn thành, {cancelledCount} đã hủy
          </p>
        </div>

        <div className="card report-stat">
          <p className="stat-label">💵 Trung bình / đơn</p>
          <h2 className="report-value">
            {formatMoney(avgOrder)}
          </h2>
          <p className="stat-sub">
            Dựa trên đơn hoàn thành
          </p>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card">
          <h2 className="chart-title">
            📈 Doanh thu theo {period === 'week' ? '7 ngày gần nhất' : 'tháng'}
          </h2>

          {chartData.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#718096' }}>
              Chưa có dữ liệu doanh thu
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={value => formatShortMoney(value)}
                />
                <Tooltip formatter={value => formatMoney(value)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#e85d04"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Doanh thu"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card chart-card">
          <h2 className="chart-title">🥧 Tỷ lệ thanh toán</h2>

          {paymentMethodData.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#718096' }}>
              Chưa có thanh toán hoàn tất
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {paymentMethodData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Legend />

                <Tooltip formatter={value => `${value} giao dịch`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card">
          <h2 className="chart-title">🏆 Món bán chạy nhất</h2>

          {topDishes.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#718096' }}>
              Chưa có dữ liệu món bán chạy
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topDishes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={160}
                />
                <Tooltip />
                <Bar
                  dataKey="orders"
                  fill="#e85d04"
                  radius={[0, 4, 4, 0]}
                  name="Số lượng bán"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card chart-card">
          <h2 className="chart-title">📦 Trạng thái đơn hàng</h2>

          {orderStatusData.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#718096' }}>
              Chưa có đơn hàng
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#3182ce"
                  radius={[4, 4, 0, 0]}
                  name="Số đơn"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 0 }}>
        <h2 className="chart-title">📋 Chi tiết món bán chạy</h2>

        {topDishes.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#718096' }}>
            Chưa có dữ liệu món bán chạy
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên món</th>
                <th>Số lượng bán</th>
                <th>Tỷ lệ</th>
              </tr>
            </thead>

            <tbody>
              {topDishes.map((dish, index) => {
                const maxOrders = topDishes[0]?.orders || 1;
                const percent = Math.round((dish.orders / maxOrders) * 100);

                return (
                  <tr key={dish.name}>
                    <td>
                      <strong style={{ color: '#e85d04' }}>
                        #{index + 1}
                      </strong>
                    </td>

                    <td>{dish.name}</td>

                    <td>{dish.orders}</td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            flex: 1,
                            height: 6,
                            background: '#f0f0f0',
                            borderRadius: 3
                          }}
                        >
                          <div
                            style={{
                              width: `${percent}%`,
                              height: '100%',
                              background: '#e85d04',
                              borderRadius: 3
                            }}
                          />
                        </div>

                        <span
                          style={{
                            fontSize: 12,
                            color: '#718096',
                            minWidth: 32
                          }}
                        >
                          {percent}%
                        </span>
                      </div>
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

export default Reports;