import React, { useState } from 'react';
import './Tables.css';

const initialTables = [
  { id: 1, name: 'Bàn 1',  capacity: 2, status: 'empty' },
  { id: 2, name: 'Bàn 2',  capacity: 4, status: 'occupied' },
  { id: 3, name: 'Bàn 3',  capacity: 4, status: 'occupied' },
  { id: 4, name: 'Bàn 4',  capacity: 6, status: 'reserved' },
  { id: 5, name: 'Bàn 5',  capacity: 2, status: 'empty' },
  { id: 6, name: 'Bàn 6',  capacity: 4, status: 'occupied' },
  { id: 7, name: 'Bàn 7',  capacity: 8, status: 'empty' },
  { id: 8, name: 'Bàn 8',  capacity: 6, status: 'occupied' },
  { id: 9, name: 'Bàn 9',  capacity: 4, status: 'reserved' },
  { id: 10, name: 'Bàn 10', capacity: 2, status: 'empty' },
  { id: 11, name: 'Bàn 11', capacity: 4, status: 'occupied' },
  { id: 12, name: 'Bàn 12', capacity: 6, status: 'empty' },
];

const statusLabel = { empty: 'Trống', occupied: 'Có khách', reserved: 'Đặt trước' };
const statusClass = { empty: 'table-empty', occupied: 'table-occupied', reserved: 'table-reserved' };

function Tables() {
  const [tables, setTables] = useState(initialTables);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? tables : tables.filter(t => t.status === filter);

  const cycleStatus = (id) => {
    const cycle = { empty: 'occupied', occupied: 'reserved', reserved: 'empty' };
    setTables(prev => prev.map(t => t.id === id ? { ...t, status: cycle[t.status] } : t));
  };

  const counts = {
    empty: tables.filter(t => t.status === 'empty').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
  };

  return (
    <div className="tables-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý bàn</h1>
        <button className="btn-primary">+ Thêm bàn</button>
      </div>

      <div className="table-summary">
        <div className="summary-item">
          <span className="dot dot-empty"></span>
          <span>Trống: <strong>{counts.empty}</strong></span>
        </div>
        <div className="summary-item">
          <span className="dot dot-occupied"></span>
          <span>Có khách: <strong>{counts.occupied}</strong></span>
        </div>
        <div className="summary-item">
          <span className="dot dot-reserved"></span>
          <span>Đặt trước: <strong>{counts.reserved}</strong></span>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'empty', 'occupied', 'reserved'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Tất cả' : statusLabel[f]}
          </button>
        ))}
      </div>

      <div className="tables-grid">
        {filtered.map(table => (
          <div
            key={table.id}
            className={`table-card ${statusClass[table.status]}`}
            onClick={() => cycleStatus(table.id)}
          >
            <div className="table-icon">🪑</div>
            <h3 className="table-name">{table.name}</h3>
            <p className="table-capacity">{table.capacity} người</p>
            <span className="table-status-badge">{statusLabel[table.status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tables;
