import React, { useState } from 'react';
import './AdminReservations.css';

const initialReservations = [
  { id: 'R001', name: 'Nguyễn Văn An',  phone: '0901-234-567', date: '2026-05-22', time: '18:00', guests: 4, status: 'confirmed', assignedTable: 'Bàn 4', note: 'Sinh nhật, cần cắm hoa bàn', preOrder: [{ name: 'Bò Wagyu nướng than hoa', qty: 2, price: 580000 }, { name: 'Rượu vang đỏ Pháp', qty: 2, price: 280000 }] },
  { id: 'R002', name: 'Trần Thị Bích',  phone: '0912-345-678', date: '2026-05-22', time: '19:00', guests: 2, status: 'pending',   assignedTable: null,    note: '', preOrder: [{ name: 'Cá hồi áp chảo sốt chanh', qty: 2, price: 320000 }] },
  { id: 'R003', name: 'Lê Minh Khoa',   phone: '0933-456-789', date: '2026-05-22', time: '19:30', guests: 6, status: 'arrived',   assignedTable: 'Bàn 7', note: 'Họp mặt gia đình', preOrder: [] },
  { id: 'R004', name: 'Phạm Thu Hà',    phone: '0944-567-890', date: '2026-05-23', time: '12:00', guests: 3, status: 'pending',   assignedTable: null,    note: '', preOrder: [{ name: 'Tôm hùm hấp bia', qty: 1, price: 750000 }] },
  { id: 'R005', name: 'Hoàng Văn Nam',  phone: '0955-678-901', date: '2026-05-23', time: '18:30', guests: 2, status: 'cancelled', assignedTable: null,    note: 'Hủy do bận', preOrder: [] },
];

const statusMap = {
  pending:   { label: 'Chờ xác nhận', cls: 'res-pending',   icon: '⏳' },
  confirmed: { label: 'Đã xác nhận',  cls: 'res-confirmed', icon: '✅' },
  arrived:   { label: 'Đã check-in',  cls: 'res-arrived',   icon: '🪑' },
  cancelled: { label: 'Đã hủy',       cls: 'res-cancelled', icon: '❌' },
};

const TABLES = ['Bàn 1','Bàn 2','Bàn 3','Bàn 4','Bàn 5','Bàn 6','Bàn 7','Bàn 8'];

function AdminReservations() {
  const [reservations, setReservations] = useState(initialReservations);
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');
  const [expanded, setExpanded] = useState(null);
  const [tableChoice, setTableChoice] = useState({});

  const update = (id, changes) => setReservations(prev => prev.map(r => r.id === id ? { ...r, ...changes } : r));

  const filtered = reservations.filter(r => {
    const matchFilter = filter === 'all' || r.status === filter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                        r.phone.includes(search) || r.id.includes(search);
    return matchFilter && matchSearch;
  });

  const stats = {
    total:     reservations.length,
    pending:   reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    arrived:   reservations.filter(r => r.status === 'arrived').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  };

  const preOrderTotal = (items) => items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="admin-reservations">
      <div className="page-header">
        <h1 className="page-title">Quản lý đặt bàn</h1>
      </div>

      {/* Stats */}
      <div className="res-admin-stats">
        {[['total','Tổng','#e85d04'],['pending','Chờ xác nhận','#d69e2e'],['confirmed','Đã xác nhận','#3182ce'],['arrived','Đã check-in','#38a169'],['cancelled','Đã hủy','#e53e3e']].map(([k,l,c]) => (
          <div key={k} className="res-stat-card" style={{borderTopColor:c}} onClick={() => setFilter(k === 'total' ? 'all' : k)}>
            <span className="res-stat-num" style={{color:c}}>{stats[k]}</span>
            <span className="res-stat-label">{l}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="res-toolbar">
        <input className="search-input" placeholder="🔍 Tìm theo tên, SĐT, mã đặt bàn..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-tabs">
          {[['all','Tất cả'],['pending','Chờ xác nhận'],['confirmed','Đã xác nhận'],['arrived','Đã check-in'],['cancelled','Đã hủy']].map(([v,l]) => (
            <button key={v} className={`filter-tab ${filter === v ? 'active' : ''}`}
              onClick={() => setFilter(v)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="res-admin-list">
        {filtered.length === 0 && (
          <div className="card" style={{textAlign:'center', padding:40, color:'#a0aec0'}}>Không có đặt bàn nào</div>
        )}
        {filtered.map(r => (
          <div key={r.id} className="res-admin-card card">
            {/* Header row */}
            <div className="res-admin-row" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
              <div className="res-col-id">
                <span className="res-admin-id">{r.id}</span>
                <span className={`res-status-badge ${statusMap[r.status].cls}`}>
                  {statusMap[r.status].icon} {statusMap[r.status].label}
                </span>
              </div>
              <div className="res-col-guest">
                <strong>{r.name}</strong>
                <span>{r.phone}</span>
              </div>
              <div className="res-col-time">
                <span>📅 {r.date}</span>
                <span>🕐 {r.time}</span>
              </div>
              <div className="res-col-info">
                <span>👥 {r.guests} người</span>
                {r.assignedTable && <span>🪑 {r.assignedTable}</span>}
                {r.preOrder.length > 0 && <span className="preorder-tag">🍽️ {r.preOrder.length} món</span>}
              </div>
              <span className="expand-arrow">{expanded === r.id ? '▲' : '▼'}</span>
            </div>

            {/* Expanded detail */}
            {expanded === r.id && (
              <div className="res-admin-detail">
                {r.note && <div className="res-note">📝 {r.note}</div>}

                {r.preOrder.length > 0 && (
                  <div className="res-preorder-section">
                    <h4>🍽️ Món đặt trước</h4>
                    {r.preOrder.map((item, i) => (
                      <div key={i} className="preorder-item-row">
                        <span>{item.name} × {item.qty}</span>
                        <span>{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                    <div className="preorder-total-row">
                      <span>Tổng dự kiến</span>
                      <strong>{preOrderTotal(r.preOrder).toLocaleString('vi-VN')}đ</strong>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="res-admin-actions">
                  {r.status === 'pending' && (
                    <>
                      <div className="confirm-row">
                        <select className="table-select"
                          value={tableChoice[r.id] || ''}
                          onChange={e => setTableChoice(prev => ({...prev, [r.id]: e.target.value}))}>
                          <option value="">-- Chọn bàn --</option>
                          {TABLES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <button className="action-btn confirm-btn"
                          disabled={!tableChoice[r.id]}
                          onClick={() => update(r.id, { status: 'confirmed', assignedTable: tableChoice[r.id] })}>
                          ✅ Xác nhận
                        </button>
                      </div>
                      <button className="action-btn cancel-btn"
                        onClick={() => update(r.id, { status: 'cancelled' })}>
                        ❌ Hủy đặt bàn
                      </button>
                    </>
                  )}
                  {r.status === 'confirmed' && (
                    <div className="confirm-row">
                      <button className="action-btn checkin-btn"
                        onClick={() => update(r.id, { status: 'arrived' })}>
                        🪑 Check-in khách
                      </button>
                      <button className="action-btn cancel-btn"
                        onClick={() => update(r.id, { status: 'cancelled' })}>
                        ❌ Hủy
                      </button>
                    </div>
                  )}
                  {(r.status === 'arrived' || r.status === 'cancelled') && (
                    <button className="action-btn undo-btn"
                      onClick={() => update(r.id, { status: 'pending', assignedTable: null })}>
                      ↩ Hoàn tác
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminReservations;
