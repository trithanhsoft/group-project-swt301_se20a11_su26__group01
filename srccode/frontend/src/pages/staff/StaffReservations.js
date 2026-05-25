import React, { useState } from 'react';
import './StaffReservations.css';

const initialReservations = [
  {
    id: 'R001', name: 'Nguyễn Văn An', phone: '0901-234-567',
    date: '2026-05-21', time: '18:00', guests: 4,
    note: 'Sinh nhật, cần cắm hoa bàn',
    preOrder: [
      { name: 'Bò Wagyu nướng than hoa', qty: 2, price: 580000 },
      { name: 'Tôm hùm hấp bia', qty: 1, price: 750000 },
      { name: 'Rượu vang đỏ Pháp', qty: 2, price: 280000 },
    ],
    status: 'pending', // pending | arrived | cancelled | no_show
    assignedTable: null,
  },
  {
    id: 'R002', name: 'Trần Thị Bích', phone: '0912-345-678',
    date: '2026-05-21', time: '19:00', guests: 2,
    note: '',
    preOrder: [
      { name: 'Cá hồi áp chảo sốt chanh', qty: 2, price: 320000 },
      { name: 'Cocktail Signature', qty: 2, price: 145000 },
    ],
    status: 'pending',
    assignedTable: null,
  },
  {
    id: 'R003', name: 'Lê Minh Khoa', phone: '0933-456-789',
    date: '2026-05-21', time: '19:30', guests: 6,
    note: 'Họp mặt gia đình',
    preOrder: [],
    status: 'arrived',
    assignedTable: 'Bàn 4',
  },
  {
    id: 'R004', name: 'Phạm Thu Hà', phone: '0944-567-890',
    date: '2026-05-21', time: '20:00', guests: 3,
    note: '',
    preOrder: [
      { name: 'Vịt quay Bắc Kinh', qty: 1, price: 420000 },
    ],
    status: 'pending',
    assignedTable: null,
  },
];

const TABLES = ['Bàn 1','Bàn 2','Bàn 4','Bàn 5','Bàn 7'];

const statusMap = {
  pending:   { label: 'Chờ đến',    cls: 'res-pending',   icon: '⏳' },
  arrived:   { label: 'Đã check-in', cls: 'res-arrived',  icon: '✅' },
  cancelled: { label: 'Đã hủy',     cls: 'res-cancelled', icon: '❌' },
  no_show:   { label: 'Không đến',  cls: 'res-noshow',    icon: '👻' },
};

function StaffReservations() {
  const [reservations, setReservations] = useState(initialReservations);
  const [selected, setSelected] = useState(null);
  const [tableChoice, setTableChoice] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? reservations
    : reservations.filter(r => r.status === filter);

  const update = (id, changes) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, ...changes } : r));
    setSelected(null);
  };

  const handleCheckin = (r) => {
    if (!tableChoice) return;
    update(r.id, { status: 'arrived', assignedTable: tableChoice });
    setTableChoice('');
  };

  const preOrderTotal = (items) =>
    items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="staff-res">
      <div className="page-header">
        <h1 className="page-title">Đặt bàn trước</h1>
        <div className="res-summary">
          <span className="res-count pending">⏳ {reservations.filter(r=>r.status==='pending').length} chờ</span>
          <span className="res-count arrived">✅ {reservations.filter(r=>r.status==='arrived').length} đã đến</span>
        </div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {[['all','Tất cả'],['pending','Chờ đến'],['arrived','Đã check-in'],['cancelled','Đã hủy'],['no_show','Không đến']].map(([val, label]) => (
          <button key={val} className={`filter-tab ${filter === val ? 'active' : ''}`} onClick={() => setFilter(val)}>
            {label}
          </button>
        ))}
      </div>

      <div className="res-list">
        {filtered.map(r => (
          <div key={r.id} className={`res-card card ${r.status === 'arrived' ? 'card-arrived' : ''}`}>
            <div className="res-card-main" onClick={() => setSelected(selected?.id === r.id ? null : r)}>
              <div className="res-col">
                <span className="res-id">{r.id}</span>
                <span className={`res-status-badge ${statusMap[r.status].cls}`}>
                  {statusMap[r.status].icon} {statusMap[r.status].label}
                </span>
              </div>
              <div className="res-col res-guest-col">
                <span className="res-name">👤 {r.name}</span>
                <span className="res-phone">📞 {r.phone}</span>
              </div>
              <div className="res-col">
                <span className="res-time">🕐 {r.time}</span>
                <span className="res-guests">👥 {r.guests} người</span>
              </div>
              <div className="res-col">
                {r.assignedTable
                  ? <span className="res-table-assigned">🪑 {r.assignedTable}</span>
                  : <span className="res-table-none">Chưa xếp bàn</span>
                }
                {r.preOrder.length > 0 && (
                  <span className="res-preorder-badge">🍽️ {r.preOrder.length} món pre-order</span>
                )}
              </div>
              <div className="res-col res-expand">
                {selected?.id === r.id ? '▲' : '▼'}
              </div>
            </div>

            {/* Expanded detail */}
            {selected?.id === r.id && (
              <div className="res-detail">
                {r.note && (
                  <div className="res-note">📝 <strong>Ghi chú:</strong> {r.note}</div>
                )}

                {r.preOrder.length > 0 && (
                  <div className="res-preorder">
                    <h4>🍽️ Món đặt trước</h4>
                    <div className="preorder-items">
                      {r.preOrder.map((item, i) => (
                        <div key={i} className="preorder-row">
                          <span>{item.name} × {item.qty}</span>
                          <span>{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                        </div>
                      ))}
                      <div className="preorder-total">
                        <span>Tổng dự kiến</span>
                        <strong>{preOrderTotal(r.preOrder).toLocaleString('vi-VN')}đ</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {r.status === 'pending' && (
                  <div className="res-actions">
                    <div className="checkin-row">
                      <select
                        className="table-select"
                        value={tableChoice}
                        onChange={e => setTableChoice(e.target.value)}
                      >
                        <option value="">-- Chọn bàn --</option>
                        {TABLES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <button
                        className="checkin-btn"
                        onClick={() => handleCheckin(r)}
                        disabled={!tableChoice}
                      >
                        ✅ Check-in khách
                      </button>
                    </div>
                    <div className="other-actions">
                      <button className="action-sm cancel-sm" onClick={() => update(r.id, { status: 'cancelled' })}>
                        ❌ Hủy đặt bàn
                      </button>
                      <button className="action-sm noshow-sm" onClick={() => update(r.id, { status: 'no_show' })}>
                        👻 Không đến
                      </button>
                    </div>
                  </div>
                )}

                {r.status === 'arrived' && (
                  <div className="arrived-info">
                    <span>✅ Đã check-in — <strong>{r.assignedTable}</strong></span>
                    <button className="action-sm" onClick={() => update(r.id, { status: 'pending', assignedTable: null })}>
                      ↩ Hoàn tác
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="no-res">Không có đặt bàn nào</div>
        )}
      </div>
    </div>
  );
}

export default StaffReservations;
