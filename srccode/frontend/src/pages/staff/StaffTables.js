import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import './StaffTables.css';

const statusLabel = {
  EMPTY: 'Trống',
  OCCUPIED: 'Có khách',
  RESERVED: 'Đặt trước',
  MERGED: 'Đã gộp',
  INACTIVE: 'Không hoạt động'
};

const statusClass = {
  EMPTY: 'tbl-empty',
  OCCUPIED: 'tbl-occupied',
  RESERVED: 'tbl-reserved',
  MERGED: 'tbl-reserved',
  INACTIVE: 'tbl-reserved'
};

function StaffTables() {
  const [tables, setTables] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState(null); // transfer | merge
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const getApiMessage = (data, fallback) => {
    if (!data) {
      return fallback;
    }

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

  const updateTableInState = (updatedTable) => {
    setTables((prev) =>
      prev.map((table) =>
        table.tableId === updatedTable.tableId ? updatedTable : table
      )
    );

    setSelected(updatedTable);
  };

  const updateStatus = async (tableId, status) => {
    setActionLoading(true);
    setError('');

    try {
      const response = await API.put(`/tables/${tableId}/status`, {
        status
      });

      updateTableInState(response.data);

      if (status === 'EMPTY') {
        setSelected(null);
      }
    } catch (error) {
      console.error('Update table status error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể cập nhật trạng thái bàn'
        )
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransfer = async (targetTableId) => {
    if (!selected?.tableId) {
      return;
    }

    setActionLoading(true);
    setError('');

    try {
      const response = await API.put(`/tables/${selected.tableId}/transfer`, {
        targetTableId
      });

      setTables(response.data || []);
      setSelected(null);
      setMode(null);
    } catch (error) {
      console.error('Transfer table error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể chuyển bàn'
        )
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleMerge = async (targetTableId) => {
    if (!selected?.tableId) {
      return;
    }

    setActionLoading(true);
    setError('');

    try {
      const response = await API.put(`/tables/${selected.tableId}/merge`, {
        targetTableId
      });

      setTables(response.data || []);
      setSelected(null);
      setMode(null);
    } catch (error) {
      console.error('Merge table error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể gộp bàn'
        )
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleSplit = async (tableId) => {
    setActionLoading(true);
    setError('');

    try {
      const response = await API.put(`/tables/${tableId}/split`);
      setTables(response.data || []);
      setSelected(null);
      setMode(null);
    } catch (error) {
      console.error('Split table error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tách bàn'
        )
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getTableName = (table) => {
    return table.tableName || table.name || `Bàn ${table.tableId}`;
  };

  const getTableStatus = (table) => {
    return table.status || 'EMPTY';
  };

  const getCurrentOrderCode = (table) => {
    return table.currentOrderCode || table.order || null;
  };

  const getReservedBy = (table) => {
    return table.reservedBy || null;
  };

  const emptyCount = tables.filter((table) => table.status === 'EMPTY').length;
  const occupiedCount = tables.filter((table) => table.status === 'OCCUPIED').length;
  const reservedCount = tables.filter((table) => table.status === 'RESERVED').length;

  const targetTables = tables.filter((table) => {
    return table.tableId !== selected?.tableId && table.status === 'EMPTY';
  });

  if (loading) {
    return (
      <div className="staff-tables">
        <div className="page-header">
          <h1 className="page-title">Quản lý bàn</h1>
        </div>

        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          ⏳ Đang tải danh sách bàn...
        </div>
      </div>
    );
  }

  return (
    <div className="staff-tables">
      <div className="page-header">
        <h1 className="page-title">Quản lý bàn</h1>

        <div className="table-legend">
          <span className="legend-item">
            <span className="dot dot-empty"></span> Trống ({emptyCount})
          </span>

          <span className="legend-item">
            <span className="dot dot-occupied"></span> Có khách ({occupiedCount})
          </span>

          <span className="legend-item">
            <span className="dot dot-reserved"></span> Đặt trước ({reservedCount})
          </span>

          <button className="btn-primary" onClick={fetchTables}>
            🔄 Làm mới
          </button>
        </div>
      </div>

      {error && (
        <div
          className="card"
          style={{
            padding: 14,
            marginBottom: 16,
            color: '#dc2626'
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {tables.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          Không có bàn nào. Hãy tạo bàn bằng API /api/tables trước.
        </div>
      ) : (
        <div className="staff-tables-grid">
          {tables.map((table) => {
            const status = getTableStatus(table);
            const tableName = getTableName(table);
            const currentOrderCode = getCurrentOrderCode(table);
            const reservedBy = getReservedBy(table);

            return (
              <div
                key={table.tableId}
                className={`staff-table-card ${statusClass[status] || 'tbl-empty'}`}
                onClick={() => {
                  setSelected(table);
                  setMode(null);
                  setError('');
                }}
              >
                <div className="tbl-icon">🪑</div>

                <h3>{tableName}</h3>

                <p className="tbl-capacity">{table.capacity} người</p>

                {currentOrderCode && (
                  <p className="tbl-order">{currentOrderCode}</p>
                )}

                {reservedBy && (
                  <p className="tbl-reserved-info">{reservedBy}</p>
                )}

                {table.mergedInto && (
                  <p className="tbl-reserved-info">
                    Gộp vào {table.mergedInto}
                  </p>
                )}

                {table.mergedWith && (
                  <p className="tbl-reserved-info">
                    Gộp với {table.mergedWith}
                  </p>
                )}

                <span className="tbl-badge">
                  {statusLabel[status] || status}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div
          className="modal-overlay"
          onClick={() => {
            setSelected(null);
            setMode(null);
          }}
        >
          <div className="tbl-modal card" onClick={(e) => e.stopPropagation()}>
            {mode === 'transfer' || mode === 'merge' ? (
              <>
                <h2>{mode === 'transfer' ? '🔄 Chuyển bàn' : '🔗 Gộp bàn'}</h2>

                <p className="modal-sub">
                  {mode === 'transfer'
                    ? `Chọn bàn trống để chuyển khách từ ${getTableName(selected)}`
                    : `Chọn bàn trống để gộp với ${getTableName(selected)}`}
                </p>

                <div className="target-table-list">
                  {targetTables.map((table) => (
                    <button
                      key={table.tableId}
                      className="target-table-btn"
                      disabled={actionLoading}
                      onClick={() =>
                        mode === 'transfer'
                          ? handleTransfer(table.tableId)
                          : handleMerge(table.tableId)
                      }
                    >
                      🪑 {getTableName(table)} ({table.capacity} chỗ)
                    </button>
                  ))}

                  {targetTables.length === 0 && (
                    <p
                      style={{
                        color: '#a0aec0',
                        fontSize: 13,
                        textAlign: 'center',
                        padding: '12px 0'
                      }}
                    >
                      Không có bàn trống
                    </p>
                  )}
                </div>

                {error && (
                  <p style={{ color: '#dc2626', fontSize: 13 }}>
                    ⚠️ {error}
                  </p>
                )}

                <button className="modal-cancel" onClick={() => setMode(null)}>
                  ← Quay lại
                </button>
              </>
            ) : (
              <>
                <h2>{getTableName(selected)}</h2>

                <p className="modal-sub">
                  Trạng thái:{' '}
                  <strong>
                    {statusLabel[getTableStatus(selected)] || getTableStatus(selected)}
                  </strong>
                </p>

                {selected.currentOrderCode && (
                  <p className="modal-sub">
                    Mã đơn:{' '}
                    <strong>{selected.currentOrderCode}</strong>
                  </p>
                )}

                {selected.reservedBy && (
                  <p className="modal-sub">
                    Đặt bởi:{' '}
                    <strong>{selected.reservedBy}</strong>
                  </p>
                )}

                {selected.mergedInto && (
                  <p className="modal-sub">
                    Đã gộp vào:{' '}
                    <strong>{selected.mergedInto}</strong>
                  </p>
                )}

                {selected.mergedWith && (
                  <p className="modal-sub">
                    Đã gộp với:{' '}
                    <strong>{selected.mergedWith}</strong>
                  </p>
                )}

                <div className="tbl-modal-actions">
                  <button
                    className="tbl-action-btn empty-btn"
                    disabled={actionLoading}
                    onClick={() => updateStatus(selected.tableId, 'EMPTY')}
                  >
                    ✓ Trống
                  </button>

                  <button
                    className="tbl-action-btn occupied-btn"
                    disabled={actionLoading}
                    onClick={() => updateStatus(selected.tableId, 'OCCUPIED')}
                  >
                    🍽️ Có khách
                  </button>

                  <button
                    className="tbl-action-btn reserved-btn"
                    disabled={actionLoading}
                    onClick={() => updateStatus(selected.tableId, 'RESERVED')}
                  >
                    📅 Đặt trước
                  </button>
                </div>

                {getTableStatus(selected) === 'OCCUPIED' && (
                  <div className="tbl-extra-actions">
                    <button
                      className="extra-btn"
                      disabled={actionLoading}
                      onClick={() => setMode('transfer')}
                    >
                      🔄 Chuyển bàn
                    </button>

                    <button
                      className="extra-btn"
                      disabled={actionLoading}
                      onClick={() => setMode('merge')}
                    >
                      🔗 Gộp bàn
                    </button>

                    {selected.mergedWith && (
                      <button
                        className="extra-btn split-btn"
                        disabled={actionLoading}
                        onClick={() => handleSplit(selected.tableId)}
                      >
                        ✂️ Tách bàn
                      </button>
                    )}
                  </div>
                )}

                {getTableStatus(selected) === 'MERGED' && (
                  <p
                    style={{
                      color: '#a0aec0',
                      fontSize: 13,
                      marginTop: 12
                    }}
                  >
                    Bàn này đang được gộp vào bàn khác. Hãy tách bàn từ bàn chính nếu cần.
                  </p>
                )}

                {error && (
                  <p style={{ color: '#dc2626', fontSize: 13 }}>
                    ⚠️ {error}
                  </p>
                )}

                <button
                  className="create-order-btn"
                  onClick={() => alert('Chức năng tạo đơn từ bàn sẽ làm sau')}
                >
                  📋 Tạo đơn hàng
                </button>

                <button className="modal-cancel" onClick={() => setSelected(null)}>
                  Đóng
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffTables;