import React, { useState } from 'react';
import './Orders.css';

const allOrders = [
  { id: '#0047', table: 'Bàn 3', waiter: 'Minh', items: ['Bò Wagyu nướng than hoa x1', 'Rượu vang đỏ Pháp x2'], total: 1140000, status: 'serving',   time: '18:32', date: '22/05/2026' },
  { id: '#0046', table: 'Bàn 7', waiter: 'Lan',  items: ['Tôm hùm hấp bia x1', 'Cocktail Signature x2'],       total: 1040000, status: 'pending',   time: '18:28', date: '22/05/2026' },
  { id: '#0045', table: 'Bàn 1', waiter: 'Hùng', items: ['Cá hồi áp chảo sốt chanh x2', 'Trà thảo mộc x1'],   total: 705000,  status: 'done',      time: '18:10', date: '22/05/2026' },
  { id: '#0044', table: 'Bàn 5', waiter: 'Minh', items: ['Vịt quay Bắc Kinh x1', 'Bánh soufflé socola x2'],    total: 670000,  status: 'done',      time: '17:55', date: '22/05/2026' },
  { id: '#0043', table: 'Bàn 9', waiter: 'Lan',  items: ['Sườn bò hầm rượu vang x2'],                          total: 760000,  status: 'cancelled', time: '17:40', date: '22/05/2026' },
  { id: '#0042', table: 'Bàn 4', waiter: 'Hùng', items: ['Gỏi tôm hùm xoài xanh x2', 'Crème brûlée vani x2'], total: 630000,  status: 'done',      time: '17:20', date: '21/05/2026' },
  { id: '#0041', table: 'Bàn 2', waiter: 'Minh', items: ['Súp bào ngư vi cá x3'],                               total: 555000,  status: 'done',      time: '12:30', date: '21/05/2026' },
];

const statusMap = {
  pending:   { label: 'Chờ xác nhận', cls: 'status-pending' },
  serving:   { label: 'Đang phục vụ', cls: 'status-serving' },
  done:      { label: 'Hoàn thành',   cls: 'status-done' },
  cancelled: { label: 'Đã huỷ',       cls: 'status-cancelled' },
};

function Orders() {
  const [filter, setFilter]   = useState('all');
  const [tab, setTab]         = useState('orders'); // orders | report
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === 'all' ? allOrders : allOrders.filter(o => o.status === filter);

  // Báo cáo đơn hàng
  const totalRevenue  = allOrders.filter(o => o.status === 'done').reduce((s, o) => s + o.total, 0);
  const totalOrders   = allOrders.length;
  const doneOrders    = allOrders.filter(o => o.status === 'done').length;
  const cancelOrders  = allOrders.filter(o => o.status === 'cancelled').length;
  const avgOrder      = doneOrders > 0 ? Math.round(totalRevenue / doneOrders) : 0;

  // Waiter stats
  const waiterStats = allOrders.reduce((acc, o) => {
    if (!acc[o.waiter]) acc[o.waiter] = { orders: 0, revenue: 0 };
    acc[o.waiter].orders++;
    if (o.status === 'done') acc[o.waiter].revenue += o.total;
    return acc;
  }, {});

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">Đơn hàng</h1>
        <div style={{display:'flex', gap:8}}>
          <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>📋 Danh sách</button>
          <button className={`tab-btn ${tab === 'report' ? 'active' : ''}`} onClick={() => setTab('report')}>📊 Báo cáo</button>
        </div>
      </div>

      {/* ── Tab: Báo cáo ── */}
      {tab === 'report' && (
        <div className="order-report">
          <div className="report-stats-grid">
            <div className="card rstat">
              <p className="rstat-label">Tổng doanh thu</p>
              <h3 className="rstat-val">{totalRevenue.toLocaleString('vi-VN')}đ</h3>
            </div>
            <div className="card rstat">
              <p className="rstat-label">Tổng đơn</p>
              <h3 className="rstat-val">{totalOrders}</h3>
            </div>
            <div className="card rstat">
              <p className="rstat-label">Hoàn thành</p>
              <h3 className="rstat-val" style={{color:'#38a169'}}>{doneOrders}</h3>
            </div>
            <div className="card rstat">
              <p className="rstat-label">Đã hủy</p>
              <h3 className="rstat-val" style={{color:'#e53e3e'}}>{cancelOrders}</h3>
            </div>
            <div className="card rstat">
              <p className="rstat-label">TB / đơn</p>
              <h3 className="rstat-val">{avgOrder.toLocaleString('vi-VN')}đ</h3>
            </div>
          </div>

          <div className="card" style={{marginTop:20}}>
            <h3 style={{fontSize:15, fontWeight:700, marginBottom:14}}>👤 Hiệu suất nhân viên</h3>
            <table className="data-table">
              <thead>
                <tr><th>Nhân viên</th><th>Số đơn</th><th>Doanh thu</th></tr>
              </thead>
              <tbody>
                {Object.entries(waiterStats).map(([name, s]) => (
                  <tr key={name}>
                    <td><strong>{name}</strong></td>
                    <td>{s.orders} đơn</td>
                    <td style={{color:'#e85d04', fontWeight:700}}>{s.revenue.toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Danh sách ── */}
      {tab === 'orders' && (
        <>
          <div className="filter-tabs" style={{ marginBottom: 16 }}>
            {[['all','Tất cả'], ['pending','Chờ xác nhận'], ['serving','Đang phục vụ'], ['done','Hoàn thành'], ['cancelled','Đã huỷ']].map(([val, label]) => (
              <button key={val} className={`filter-tab ${filter === val ? 'active' : ''}`}
                onClick={() => setFilter(val)}>{label}</button>
            ))}
          </div>

          <div className="orders-list">
            {filtered.map(order => (
              <div key={order.id} className="order-row card">
                <div className="order-col order-id-col">
                  <span className="order-id">{order.id}</span>
                  <span className="order-time">{order.time}</span>
                  <span style={{fontSize:11, color:'#a0aec0'}}>{order.date}</span>
                </div>
                <div className="order-col">
                  <span className="order-table">🪑 {order.table}</span>
                  <span className="order-waiter">👤 {order.waiter}</span>
                </div>
                <div className="order-col order-items-col">
                  {order.items.map((item, i) => <span key={i} className="order-item-tag">{item}</span>)}
                </div>
                <div className="order-col">
                  <span className="order-total">{order.total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="order-col">
                  <span className={`status-badge ${statusMap[order.status].cls}`}>
                    {statusMap[order.status].label}
                  </span>
                </div>
                <div className="order-col order-actions">
                  <button className="action-btn" title="Xem chi tiết"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}>👁️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;
