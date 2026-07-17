import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import './StaffReservations.css';

const statusMap = {
  PENDING: {
    label: 'Chờ xác nhận',
    cls: 'res-pending',
    icon: '⏳'
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    cls: 'res-pending',
    icon: '📌'
  },
  SEATED: {
    label: 'Đã check-in',
    cls: 'res-arrived',
    icon: '✅'
  },
  COMPLETED: {
    label: 'Hoàn tất',
    cls: 'res-arrived',
    icon: '🏁'
  },
  CANCELLED: {
    label: 'Đã hủy',
    cls: 'res-cancelled',
    icon: '❌'
  },
  NO_SHOW: {
    label: 'Không đến',
    cls: 'res-noshow',
    icon: '👻'
  }
};

const FILTERS = [
  ['all', 'Tất cả'],
  ['PENDING', 'Chờ xác nhận'],
  ['CONFIRMED', 'Đã xác nhận'],
  ['SEATED', 'Đã check-in'],
  ['COMPLETED', 'Hoàn tất'],
  ['CANCELLED', 'Đã hủy'],
  ['NO_SHOW', 'Không đến']
];

function StaffReservations() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);

  const [selected, setSelected] = useState(null);
  const [tableChoice, setTableChoice] = useState('');
  const [filter, setFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
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

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [reservationRes, tableRes] = await Promise.all([
        API.get('/reservations'),
        API.get('/tables')
      ]);

      setReservations(reservationRes.data || []);
      setTables(tableRes.data || []);
    } catch (error) {
      console.error('Fetch reservations error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tải danh sách đặt bàn'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    setError('');

    try {
      const response = await API.get('/reservations');
      setReservations(response.data || []);
    } catch (error) {
      console.error('Refresh reservations error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể làm mới danh sách đặt bàn'
        )
      );
    }
  };

  const fetchTables = async () => {
    try {
      const response = await API.get('/tables');
      setTables(response.data || []);
    } catch (error) {
      console.error('Refresh tables error:', error);
    }
  };

  const updateReservationInState = (updatedReservation) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.reservationId === updatedReservation.reservationId
          ? updatedReservation
          : reservation
      )
    );

    setSelected(updatedReservation);
  };

  const updateStatus = async (reservationId, status) => {
    setActionLoadingId(reservationId);
    setError('');

    try {
      const response = await API.put(`/reservations/${reservationId}/status`, {
        status
      });

      updateReservationInState(response.data);
    } catch (error) {
      console.error('Update reservation status error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể cập nhật trạng thái đặt bàn'
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCheckin = async (reservation) => {
    if (!tableChoice) {
      setError('Vui lòng chọn bàn trước khi check-in');
      return;
    }

    setActionLoadingId(reservation.reservationId);
    setError('');

    try {
      const response = await API.put(`/reservations/${reservation.reservationId}/check-in`, {
        assignedTable: tableChoice
      });

      updateReservationInState(response.data);

      const selectedTable = tables.find((table) => table.tableName === tableChoice);

      if (selectedTable?.tableId) {
        await API.put(`/tables/${selectedTable.tableId}/status`, {
          status: 'OCCUPIED',
          reservedBy: `${reservation.customerName} - ${reservation.reservationTime}`
        });

        await fetchTables();
      }

      setTableChoice('');
    } catch (error) {
      console.error('Check-in reservation error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể check-in khách'
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const cancelReservation = async (reservationId) => {
    const confirmCancel = window.confirm('Bạn có chắc muốn hủy đặt bàn này không?');

    if (!confirmCancel) {
      return;
    }

    setActionLoadingId(reservationId);
    setError('');

    try {
      await API.delete(`/reservations/${reservationId}`);

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.reservationId === reservationId
            ? {
                ...reservation,
                status: 'CANCELLED',
                assignedTable: null
              }
            : reservation
        )
      );

      setSelected(null);
    } catch (error) {
      console.error('Cancel reservation error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể hủy đặt bàn'
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const markNoShow = async (reservationId) => {
    await updateStatus(reservationId, 'NO_SHOW');
  };

  const completeReservation = async (reservation) => {
    setActionLoadingId(reservation.reservationId);
    setError('');

    try {
      const response = await API.put(`/reservations/${reservation.reservationId}/status`, {
        status: 'COMPLETED'
      });

      updateReservationInState(response.data);

      if (reservation.assignedTable) {
        const assignedTable = tables.find(
          (table) => table.tableName === reservation.assignedTable
        );

        if (assignedTable?.tableId) {
          await API.put(`/tables/${assignedTable.tableId}/status`, {
            status: 'EMPTY'
          });

          await fetchTables();
        }
      }
    } catch (error) {
      console.error('Complete reservation error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể hoàn tất đặt bàn'
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const undoCheckin = async (reservation) => {
    setActionLoadingId(reservation.reservationId);
    setError('');

    try {
      const response = await API.put(`/reservations/${reservation.reservationId}/status`, {
        status: 'CONFIRMED'
      });

      updateReservationInState({
        ...response.data,
        assignedTable: null
      });

      if (reservation.assignedTable) {
        const assignedTable = tables.find(
          (table) => table.tableName === reservation.assignedTable
        );

        if (assignedTable?.tableId) {
          await API.put(`/tables/${assignedTable.tableId}/status`, {
            status: 'EMPTY'
          });

          await fetchTables();
        }
      }

      await fetchReservations();
    } catch (error) {
      console.error('Undo check-in error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể hoàn tác check-in'
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (value) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('vi-VN');
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString('vi-VN');
  };

  const preOrderTotal = (items) => {
    return (items || []).reduce((sum, item) => {
      return sum + Number(item.subtotal || 0);
    }, 0);
  };

  const getStatusInfo = (status) => {
    return (
      statusMap[status] || {
        label: status || 'Không xác định',
        cls: 'res-pending',
        icon: 'ℹ️'
      }
    );
  };

  const availableTables = tables.filter((table) => {
    return table.status === 'EMPTY' || table.status === 'RESERVED';
  });

  const filtered =
    filter === 'all'
      ? reservations
      : reservations.filter((reservation) => reservation.status === filter);

  const pendingCount = reservations.filter(
    (reservation) => reservation.status === 'PENDING'
  ).length;

  const confirmedCount = reservations.filter(
    (reservation) => reservation.status === 'CONFIRMED'
  ).length;

  const seatedCount = reservations.filter(
    (reservation) => reservation.status === 'SEATED'
  ).length;

  if (loading) {
    return (
      <div className="staff-res">
        <div className="page-header">
          <h1 className="page-title">Đặt bàn trước</h1>
        </div>

        <div className="no-res">⏳ Đang tải danh sách đặt bàn...</div>
      </div>
    );
  }

  return (
    <div className="staff-res">
      <div className="page-header">
        <h1 className="page-title">Đặt bàn trước</h1>

        <div className="res-summary">
          <span className="res-count pending">⏳ {pendingCount} chờ</span>
          <span className="res-count pending">📌 {confirmedCount} đã xác nhận</span>
          <span className="res-count arrived">✅ {seatedCount} đã đến</span>

          <button className="btn-primary" onClick={fetchData}>
            🔄 Làm mới
          </button>
        </div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {FILTERS.map(([value, label]) => (
          <button
            key={value}
            className={`filter-tab ${filter === value ? 'active' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
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

      <div className="res-list">
        {filtered.map((reservation) => {
          const statusInfo = getStatusInfo(reservation.status);
          const isActionLoading = actionLoadingId === reservation.reservationId;

          return (
            <div
              key={reservation.reservationId}
              className={`res-card card ${
                reservation.status === 'SEATED' ? 'card-arrived' : ''
              }`}
            >
              <div
                className="res-card-main"
                onClick={() =>
                  setSelected(
                    selected?.reservationId === reservation.reservationId
                      ? null
                      : reservation
                  )
                }
              >
                <div className="res-col">
                  <span className="res-id">
                    {reservation.reservationCode || `#${reservation.reservationId}`}
                  </span>

                  <span className={`res-status-badge ${statusInfo.cls}`}>
                    {statusInfo.icon} {statusInfo.label}
                  </span>
                </div>

                <div className="res-col res-guest-col">
                  <span className="res-name">
                    👤 {reservation.customerName}
                  </span>

                  <span className="res-phone">
                    📞 {reservation.customerPhone}
                  </span>
                </div>

                <div className="res-col">
                  <span className="res-time">
                    📅 {formatDate(reservation.reservationDate)}
                  </span>

                  <span className="res-time">
                    🕐 {reservation.reservationTime}
                  </span>

                  <span className="res-guests">
                    👥 {reservation.numberOfGuests} người
                  </span>
                </div>

                <div className="res-col">
                  {reservation.assignedTable ? (
                    <span className="res-table-assigned">
                      🪑 {reservation.assignedTable}
                    </span>
                  ) : (
                    <span className="res-table-none">Chưa xếp bàn</span>
                  )}

                  {reservation.items?.length > 0 && (
                    <span className="res-preorder-badge">
                      🍽️ {reservation.items.length} món pre-order
                    </span>
                  )}
                </div>

                <div className="res-col res-expand">
                  {selected?.reservationId === reservation.reservationId ? '▲' : '▼'}
                </div>
              </div>

              {selected?.reservationId === reservation.reservationId && (
                <div className="res-detail">
                  {reservation.note && (
                    <div className="res-note">
                      📝 <strong>Ghi chú:</strong> {reservation.note}
                    </div>
                  )}

                  {reservation.items?.length > 0 && (
                    <div className="res-preorder">
                      <h4>🍽️ Món đặt trước</h4>

                      <div className="preorder-items">
                        {reservation.items.map((item) => (
                          <div
                            key={item.reservationItemId}
                            className="preorder-row"
                          >
                            <span>
                              {item.emoji ? `${item.emoji} ` : ''}
                              {item.foodName} × {item.quantity}
                            </span>

                            <span>{formatMoney(item.subtotal)}đ</span>
                          </div>
                        ))}

                        <div className="preorder-total">
                          <span>Tổng dự kiến</span>
                          <strong>
                            {formatMoney(
                              reservation.preOrderTotal ||
                                preOrderTotal(reservation.items)
                            )}
                            đ
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {(reservation.status === 'PENDING' ||
                    reservation.status === 'CONFIRMED') && (
                    <div className="res-actions">
                      {reservation.status === 'PENDING' && (
                        <button
                          className="checkin-btn"
                          disabled={isActionLoading}
                          onClick={() =>
                            updateStatus(reservation.reservationId, 'CONFIRMED')
                          }
                        >
                          {isActionLoading ? 'Đang xử lý...' : '📌 Xác nhận đặt bàn'}
                        </button>
                      )}

                      <div className="checkin-row">
                        <select
                          className="table-select"
                          value={tableChoice}
                          onChange={(e) => setTableChoice(e.target.value)}
                        >
                          <option value="">-- Chọn bàn --</option>

                          {availableTables.map((table) => (
                            <option key={table.tableId} value={table.tableName}>
                              {table.tableName} ({table.capacity} chỗ)
                            </option>
                          ))}
                        </select>

                        <button
                          className="checkin-btn"
                          onClick={() => handleCheckin(reservation)}
                          disabled={!tableChoice || isActionLoading}
                        >
                          {isActionLoading ? 'Đang xử lý...' : '✅ Check-in khách'}
                        </button>
                      </div>

                      <div className="other-actions">
                        <button
                          className="action-sm cancel-sm"
                          disabled={isActionLoading}
                          onClick={() => cancelReservation(reservation.reservationId)}
                        >
                          ❌ Hủy đặt bàn
                        </button>

                        <button
                          className="action-sm noshow-sm"
                          disabled={isActionLoading}
                          onClick={() => markNoShow(reservation.reservationId)}
                        >
                          👻 Không đến
                        </button>
                      </div>
                    </div>
                  )}

                  {reservation.status === 'SEATED' && (
                    <div className="arrived-info">
                      <span>
                        ✅ Đã check-in —{' '}
                        <strong>{reservation.assignedTable}</strong>
                      </span>

                      <button
                        className="action-sm"
                        disabled={isActionLoading}
                        onClick={() => completeReservation(reservation)}
                      >
                        🏁 Hoàn tất
                      </button>

                      <button
                        className="action-sm"
                        disabled={isActionLoading}
                        onClick={() => undoCheckin(reservation)}
                      >
                        ↩ Hoàn tác
                      </button>
                    </div>
                  )}

                  {(reservation.status === 'CANCELLED' ||
                    reservation.status === 'NO_SHOW' ||
                    reservation.status === 'COMPLETED') && (
                    <div className="arrived-info">
                      <span>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="no-res">Không có đặt bàn nào</div>
        )}
      </div>
    </div>
  );
}

export default StaffReservations;