import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TOP_DISHES } from '../data/menuData';
import './Reports.css';

const monthlyData = [
  { month: 'T1', revenue: 85000000,  orders: 312 },
  { month: 'T2', revenue: 92000000,  orders: 338 },
  { month: 'T3', revenue: 78000000,  orders: 287 },
  { month: 'T4', revenue: 105000000, orders: 385 },
  { month: 'T5', revenue: 118000000, orders: 433 },
  { month: 'T6', revenue: 132000000, orders: 484 },
];

const categoryData = [
  { name: 'Món chính',   value: 52 },
  { name: 'Đồ uống',     value: 22 },
  { name: 'Khai vị',     value: 16 },
  { name: 'Tráng miệng', value: 10 },
];

const COLORS = ['#e85d04', '#3182ce', '#38a169', '#d69e2e'];

const weeklyData = [
  { day: 'T2', revenue: 4200000 },
  { day: 'T3', revenue: 3800000 },
  { day: 'T4', revenue: 5100000 },
  { day: 'T5', revenue: 4700000 },
  { day: 'T6', revenue: 6200000 },
  { day: 'T7', revenue: 7800000 },
  { day: 'CN', revenue: 8100000 },
];

function Reports() {
  const [period, setPeriod] = useState('month');

  const data = period === 'week' ? weeklyData : monthlyData;
  const xKey = period === 'week' ? 'day' : 'month';

  const totalRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders  = monthlyData.reduce((s, d) => s + d.orders, 0);
  const avgOrder     = Math.round(totalRevenue / totalOrders);

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1 className="page-title">Báo cáo & Thống kê</h1>
        <div className="period-tabs">
          {[['week','Tuần'], ['month','Tháng'], ['year','Năm']].map(([val, label]) => (
            <button key={val} className={`filter-tab ${period === val ? 'active' : ''}`}
              onClick={() => setPeriod(val)}>{label}</button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="report-stats">
        <div className="card report-stat">
          <p className="stat-label">💰 Tổng doanh thu</p>
          <h2 className="report-value">{(totalRevenue/1000000).toFixed(0)}M đ</h2>
          <p className="stat-sub">↑ 18% so với kỳ trước</p>
        </div>
        <div className="card report-stat">
          <p className="stat-label">📋 Tổng đơn hàng</p>
          <h2 className="report-value">{totalOrders.toLocaleString('vi-VN')}</h2>
          <p className="stat-sub">↑ 12% so với kỳ trước</p>
        </div>
        <div className="card report-stat">
          <p className="stat-label">💵 Trung bình / đơn</p>
          <h2 className="report-value">{avgOrder.toLocaleString('vi-VN')}đ</h2>
          <p className="stat-sub">↑ 5% so với kỳ trước</p>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="charts-row">
        <div className="card chart-card">
          <h2 className="chart-title">📈 Doanh thu theo {period === 'week' ? 'tuần' : 'tháng'}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip formatter={v => `${v?.toLocaleString('vi-VN')}đ`} />
              <Line type="monotone" dataKey="revenue" stroke="#e85d04" strokeWidth={2} dot={{ r: 4 }} name="Doanh thu" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h2 className="chart-title">🥧 Tỷ lệ danh mục</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                label={({ name, value }) => `${value}%`}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip formatter={v => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="charts-row">
        <div className="card chart-card">
          <h2 className="chart-title">🏆 Món bán chạy nhất</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TOP_DISHES} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={160} />
              <Tooltip />
              <Bar dataKey="orders" fill="#e85d04" radius={[0, 4, 4, 0]} name="Số đơn" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <h2 className="chart-title">📦 Số đơn hàng theo tháng</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#3182ce" radius={[4, 4, 0, 0]} name="Đơn hàng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top dishes table */}
      <div className="card" style={{marginTop: 0}}>
        <h2 className="chart-title">📋 Chi tiết món bán chạy</h2>
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Tên món</th><th>Số đơn</th><th>Tỷ lệ</th></tr>
          </thead>
          <tbody>
            {TOP_DISHES.map((dish, i) => (
              <tr key={i}>
                <td><strong style={{color:'#e85d04'}}>#{i+1}</strong></td>
                <td>{dish.name}</td>
                <td>{dish.orders}</td>
                <td>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <div style={{flex:1, height:6, background:'#f0f0f0', borderRadius:3}}>
                      <div style={{width:`${Math.round(dish.orders/TOP_DISHES[0].orders*100)}%`, height:'100%', background:'#e85d04', borderRadius:3}}></div>
                    </div>
                    <span style={{fontSize:12, color:'#718096', minWidth:32}}>
                      {Math.round(dish.orders/TOP_DISHES[0].orders*100)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
