import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TOP_DISHES } from '../data/menuData';
import './Dashboard.css';

const revenueData = [
  { day: 'T2', revenue: 4200000 },
  { day: 'T3', revenue: 3800000 },
  { day: 'T4', revenue: 5100000 },
  { day: 'T5', revenue: 4700000 },
  { day: 'T6', revenue: 6200000 },
  { day: 'T7', revenue: 7800000 },
  { day: 'CN', revenue: 8100000 },
];

const topDishes = TOP_DISHES;

const recentOrders = [
  { id: '#001', table: 'Bàn 5', items: 3, total: '1.580.000đ', status: 'Đang phục vụ' },
  { id: '#002', table: 'Bàn 2', items: 2, total: '900.000đ',   status: 'Hoàn thành' },
  { id: '#003', table: 'Bàn 8', items: 4, total: '2.100.000đ', status: 'Đang phục vụ' },
  { id: '#004', table: 'Bàn 1', items: 2, total: '760.000đ',   status: 'Chờ xác nhận' },
];

const statusColor = {
  'Đang phục vụ': 'status-serving',
  'Hoàn thành': 'status-done',
  'Chờ xác nhận': 'status-pending',
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
  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        <StatCard icon="💰" label="Doanh thu hôm nay" value="8.100.000đ" sub="↑ 12% so với hôm qua" color="#fff0e6" />
        <StatCard icon="📋" label="Đơn hàng hôm nay" value="47" sub="↑ 5 đơn so với hôm qua" color="#e6f4ff" />
        <StatCard icon="🪑" label="Bàn đang phục vụ" value="12 / 20" sub="8 bàn còn trống" color="#e6fff0" />
        <StatCard icon="👥" label="Khách hôm nay" value="134" sub="↑ 8% so với hôm qua" color="#fff6e6" />
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
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={v => `${v.toLocaleString('vi-VN')}đ`} />
              <Area type="monotone" dataKey="revenue" stroke="#e85d04" fill="url(#colorRev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h2 className="chart-title">Món bán chạy</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topDishes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={90} />
              <Tooltip />
              <Bar dataKey="orders" fill="#e85d04" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="chart-title">Đơn hàng gần đây</h2>
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
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td>{order.table}</td>
                <td>{order.items} món</td>
                <td className="order-total">{order.total}</td>
                <td><span className={`status-badge ${statusColor[order.status]}`}>{order.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
