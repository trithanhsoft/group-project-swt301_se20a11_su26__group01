import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './Tables.css';

const statusLabel = {
  EMPTY: 'Trống',
  OCCUPIED: 'Có khách',
  RESERVED: 'Đặt trước',
  MERGED: 'Gộp bàn',
  INACTIVE: 'Ngưng dùng'
};

const statusClass = {
  EMPTY: 'table-empty',
  OCCUPIED: 'table-occupied',
  RESERVED: 'table-reserved',
  MERGED: 'table-merged',
  INACTIVE: 'table-inactive'
};

const filterOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'EMPTY', label: 'Trống' },
  { value: 'OCCUPIED', label: 'Có khách' },
  { value: 'RESERVED', label: 'Đặt trước' },
  { value: 'MERGED', label: 'Gộp bàn' },
  { value: 'INACTIVE', label: 'Ngưng dùng' }
];

function Tables() {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTables();
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

  const fetchTables = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get('/tables');
      setTables(response.data || []);
    } catch (error) {
      console.error('Fetch tables error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tải danh sách bàn'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTables =
    filter === 'all'
      ? tables
      : tables.filter((table) => table.status === filter);

  const counts = {
    EMPTY: tables.filter((table) => table.status === 'EMPTY').length,
    OCCUPIED: tables.filter((table) => table.status === 'OCCUPIED').length,
    RESERVED: tables.filter((table) => table.status === 'RESERVED').length,
    MERGED: tables.filter((table) => table.status === 'MERGED').length,
    INACTIVE: tables.filter((table) => table.status === 'INACTIVE').length
  };

  if (loading) {
    return (
      <div className="tables-page">
        <h1 className="page-title">Quản lý bàn</h1>

        <div className="table-summary">
          ⏳ Đang tải danh sách bàn...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tables-page">
        <div className="page-header">
          <h1 className="page-title">Quản lý bàn</h1>

          <button className="btn-primary" onClick={fetchTables}>
            🔄 Thử lại
          </button>
        </div>

        <div className="table-summary" style={{ color: '#dc2626' }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="tables-page">
      <div className="page-header">
        <h1 className="page-title">Quản lý bàn</h1>

        <button className="btn-primary" onClick={fetchTables}>
          🔄 Làm mới
        </button>
      </div>

      <div className="table-summary">
        <div className="summary-item">
          <span className="dot dot-empty"></span>
          <span>Trống: <strong>{counts.EMPTY}</strong></span>
        </div>

        <div className="summary-item">
          <span className="dot dot-occupied"></span>
          <span>Có khách: <strong>{counts.OCCUPIED}</strong></span>
        </div>

        <div className="summary-item">
          <span className="dot dot-reserved"></span>
          <span>Đặt trước: <strong>{counts.RESERVED}</strong></span>
        </div>

        <div className="summary-item">
          <span className="dot dot-merged"></span>
          <span>Gộp bàn: <strong>{counts.MERGED}</strong></span>
        </div>

        <div className="summary-item">
          <span className="dot dot-inactive"></span>
          <span>Ngưng dùng: <strong>{counts.INACTIVE}</strong></span>
        </div>
      </div>

      <div className="filter-tabs">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`filter-tab ${filter === option.value ? 'active' : ''}`}
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filteredTables.length === 0 ? (
        <div className="table-summary">
          Không có bàn nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className="tables-grid">
          {filteredTables.map((table) => (
            <div
              key={table.tableId}
              className={`table-card ${statusClass[table.status] || ''}`}
            >
              <div className="table-icon">🪑</div>

              <h3 className="table-name">
                {table.tableName || `Bàn ${table.tableId}`}
              </h3>

              <p className="table-capacity">
                {table.capacity || 0} người
              </p>

              {table.currentOrderCode && (
                <p className="table-order-code">
                  {table.currentOrderCode}
                </p>
              )}

              {table.reservedBy && (
                <p className="table-reserved-by">
                  {table.reservedBy}
                </p>
              )}

              <span className="table-status-badge">
                {statusLabel[table.status] || table.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tables;