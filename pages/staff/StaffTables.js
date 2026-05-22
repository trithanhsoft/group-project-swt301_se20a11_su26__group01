import React, { useState } from 'react';
// import { recommendTable } from '../../services/analyticsAI';
import './StaffTables.css';

const initialTables = [
  { id: 1, name: 'Bàn 1', capacity: 2, status: 'empty' },
  { id: 2, name: 'Bàn 2', capacity: 4, status: 'occupied', order: '#S012' },
  { id: 3, name: 'Bàn 3', capacity: 4, status: 'occupied', order: '#S013' },
  { id: 4, name: 'Bàn 4', capacity: 6, status: 'reserved', reservedBy: 'Nguyễn Văn A - 19:00' },
  { id: 5, name: 'Bàn 5', capacity: 2, status: 'empty' },
  { id: 6, name: 'Bàn 6', capacity: 4, status: 'occupied', order: '#S014' },
  { id: 7, name: 'Bàn 7', capacity: 8, status: 'empty' },
  { id: 8, name: 'Bàn 8', capacity: 6, status: 'occupied', order: '#S015' },
];

const statusLabel = { empty: 'Trống', occupied: 'Có khách', reserved: 'Đặt trước' };
const statusClass = { empty: 'tbl-empty', occupied: 'tbl-occupied', reserved: 'tbl-reserved' };

function StaffTables() {
  const [tables, setTables] = useState(initialTables);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState(null); // 'transfer' | 'merge'
  const [transferTarget, setTransferTarget] = useState(null);

  const updateStatus = (id, status) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setSelected(null);
  };

  // Chuyển bàn: move order từ selected sang target
  const handleTransfer = (targetId) => {
    const src = selected;
    setTables(prev => prev.map(t => {
      if (t.id === src.id) return { ...t, status: 'empty', order: null };
      if (t.id === targetId) return { ...t, status: 'occupied', order: src.order };
      return t;
    }));
    setSelected(null); setMode(null); setTransferTarget(null);
  };

  // Gộp bàn: merge target vào selected
  const handleMerge = (targetId) => {
    const src = selected;
    const target = tables.find(t => t.id === targetId);
    setTables(prev => prev.map(t => {
      if (t.id === src.id) return { ...t, mergedWith: [...(t.mergedWith||[]), target.name], capacity: t.capacity + target.capacity };
      if (t.id === targetId) return { ...t, status: 'merged', mergedInto: src.name };
      return t;
    }));
    setSelected(null); setMode(null);
  };

  // Tách bàn
  const handleSplit = (id) => {
    const tbl = tables.find(t => t.id === id);
    if (!tbl.mergedWith?.length) return;
    const origCapacity = tbl.capacity - tbl.mergedWith.length * 4;
    setTables(prev => prev.map(t => {
      if (t.id === id) return { ...t, mergedWith: [], capacity: origCapacity };
      if (tbl.mergedWith.includes(t.name)) return { ...t, status: 'empty', mergedInto: null };
      return t;
    }));
    setSelected(null);
  };

  return (
    <div className="staff-tables">
      <div className="page-header">
        <h1 className="page-title">Quản lý bàn</h1>
        <div className="table-legend">
          <span className="legend-item"><span className="dot dot-empty"></span> Trống ({tables.filter(t=>t.status==='empty').length})</span>
          <span className="legend-item"><span className="dot dot-occupied"></span> Có khách ({tables.filter(t=>t.status==='occupied').length})</span>
          <span className="legend-item"><span className="dot dot-reserved"></span> Đặt trước ({tables.filter(t=>t.status==='reserved').length})</span>
        </div>
      </div>

      <div className="staff-tables-grid">        {tables.map(table => (
          <div key={table.id}
            className={`staff-table-card ${statusClass[table.status]}`}
            onClick={() => setSelected(table)}>
            <div className="tbl-icon">🪑</div>
            <h3>{table.name}</h3>
            <p className="tbl-capacity">{table.capacity} người</p>
            {table.order && <p className="tbl-order">{table.order}</p>}
            {table.reservedBy && <p className="tbl-reserved-info">{table.reservedBy}</p>}
            <span className="tbl-badge">{statusLabel[table.status]}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => { setSelected(null); setMode(null); }}>
          <div className="tbl-modal card" onClick={e => e.stopPropagation()}>
            {mode === 'transfer' || mode === 'merge' ? (
              <>
                <h2>{mode === 'transfer' ? '🔄 Chuyển bàn' : '🔗 Gộp bàn'}</h2>
                <p className="modal-sub">
                  {mode === 'transfer' ? `Chọn bàn trống để chuyển khách từ ${selected.name}` : `Chọn bàn để gộp với ${selected.name}`}
                </p>
                <div className="target-table-list">
                  {tables.filter(t => t.id !== selected.id && t.status === 'empty').map(t => (
                    <button key={t.id} className="target-table-btn"
                      onClick={() => mode === 'transfer' ? handleTransfer(t.id) : handleMerge(t.id)}>
                      🪑 {t.name} ({t.capacity} chỗ)
                    </button>
                  ))}
                  {tables.filter(t => t.id !== selected.id && t.status === 'empty').length === 0 && (
                    <p style={{color:'#a0aec0', fontSize:13, textAlign:'center', padding:'12px 0'}}>Không có bàn trống</p>
                  )}
                </div>
                <button className="modal-cancel" onClick={() => setMode(null)}>← Quay lại</button>
              </>
            ) : (
              <>
                <h2>{selected.name}</h2>
                <p className="modal-sub">Trạng thái: <strong>{statusLabel[selected.status] || selected.status}</strong></p>
                <div className="tbl-modal-actions">
                  <button className="tbl-action-btn empty-btn" onClick={() => updateStatus(selected.id, 'empty')}>✓ Trống</button>
                  <button className="tbl-action-btn occupied-btn" onClick={() => updateStatus(selected.id, 'occupied')}>🍽️ Có khách</button>
                  <button className="tbl-action-btn reserved-btn" onClick={() => updateStatus(selected.id, 'reserved')}>📅 Đặt trước</button>
                </div>
                {selected.status === 'occupied' && (
                  <div className="tbl-extra-actions">
                    <button className="extra-btn" onClick={() => setMode('transfer')}>🔄 Chuyển bàn</button>
                    <button className="extra-btn" onClick={() => setMode('merge')}>🔗 Gộp bàn</button>
                    {selected.mergedWith?.length > 0 && (
                      <button className="extra-btn split-btn" onClick={() => handleSplit(selected.id)}>✂️ Tách bàn</button>
                    )}
                  </div>
                )}
                <button className="create-order-btn">📋 Tạo đơn hàng</button>
                <button className="modal-cancel" onClick={() => setSelected(null)}>Đóng</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffTables;
