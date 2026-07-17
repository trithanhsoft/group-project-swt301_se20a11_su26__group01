import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import './AdminReservations.css';

const statusMap = {
  PENDING: {
    label: 'Chờ xác nhận',
    cls: 'res-pending',
    icon: '⏳'
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    cls: 'res-confirmed',
    icon: '✅'
  },
  SEATED: {
    label: 'Đã nhận bàn',
    cls: 'res-arrived',
    icon: '🪑'
  },
  COMPLETED: {
    label: 'Hoàn thành',
    cls: 'res-completed',
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
    icon: '🚫'
  }
};

const filterOptions = [
  ['all', 'Tất cả'],
  ['PENDING', 'Chờ xác nhận'],
  ['CONFIRMED', 'Đã xác nhận'],
  ['SEATED', 'Đã nhận bàn'],
  ['COMPLETED', 'Hoàn thành'],
  ['CANCELLED', 'Đã hủy'],
  ['NO_SHOW', 'Không đến']
];

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
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

  const fetchReservations = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get('/reservations');
      setReservations(response.data || []);
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

  const getReservationId = (reservation) => {
    return reservation.reservationId || reservation.id;
  };

  const getReservationCode = (reservation) => {
    return (
      reservation.reservationCode ||
      reservation.code ||
      `R${getReservationId(reservation)}`
    );
  };

  const getCustomerName = (reservation) => {
    return (
      reservation.customerName ||
      reservation.name ||
      reservation.userName ||
      reservation.username ||
      'Khách hàng'
    );
  };

  const getCustomerPhone = (reservation) => {
    return (
      reservation.customerPhone ||
      reservation.phone ||
      reservation.phoneNumber ||
      ''
    );
  };

  const getGuestCount = (reservation) => {
    return (
      reservation.numberOfGuests ||
      reservation.guestCount ||
      reservation.guests ||
      reservation.people ||
      0
    );
  };

  const getTableName = (reservation) => {
    return (
      reservation.tableName ||
      reservation.assignedTable ||
      reservation.restaurantTableName ||
      ''
    );
  };

  const getReservationDateTime = (reservation) => {
    return (
      reservation.reservationDateTime ||
      reservation.reservationTime ||
      reservation.bookingTime ||
      reservation.dateTime ||
      reservation.createdAt ||
      null
    );
  };

  const getReservationDate = (reservation) => {
    if (reservation.date) return reservation.date;
    if (reservation.reservationDate) return reservation.reservationDate;

    const dateTime = getReservationDateTime(reservation);

    if (!dateTime) return '';

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('vi-VN');
  };

  const getReservationTime = (reservation) => {
    if (reservation.time) return reservation.time;
    if (reservation.reservationHour) return reservation.reservationHour;

    const dateTime = getReservationDateTime(reservation);

    if (!dateTime) return '';

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNote = (reservation) => {
    return reservation.note || reservation.specialRequest || reservation.description || '';
  };

  const getReservationItems = (reservation) => {
    return reservation.items || reservation.reservationItems || reservation.preOrder || [];
  };

  const getItemName = (item) => {
    return item.foodName || item.name || 'Món ăn';
  };

  const getItemQty = (item) => {
    return item.quantity || item.qty || 0;
  };

  const getItemPrice = (item) => {
    return Number(item.price || item.unitPrice || 0);
  };

  const preOrderTotal = (items) => {
    return items.reduce((sum, item) => {
      return sum + getItemPrice(item) * getItemQty(item);
    }, 0);
  };

  const getStatusInfo = (status) => {
    return (
      statusMap[status] || {
        label: status || 'Không xác định',
        cls: 'res-pending',
        icon: '❔'
      }
    );
  };

  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      try {
        await API.put(`/reservations/${reservationId}/status`, {
          status: newStatus
        });
      } catch (firstError) {
        await API.put(`/reservations/${reservationId}/status`, {
          reservationStatus: newStatus
        });
      }

      await fetchReservations();
    } catch (error) {
      console.error('Update reservation status error:', error);

      alert(
        getApiMessage(
          error.response?.data,
          'Không thể cập nhật trạng thái đặt bàn'
        )
      );
    }
  };

  const filtered = reservations.filter((reservation) => {
    const keyword = search.trim().toLowerCase();

    const reservationId = String(getReservationId(reservation) || '').toLowerCase();
    const reservationCode = String(getReservationCode(reservation) || '').toLowerCase();
    const customerName = String(getCustomerName(reservation) || '').toLowerCase();
    const customerPhone = String(getCustomerPhone(reservation) || '').toLowerCase();
    const tableName = String(getTableName(reservation) || '').toLowerCase();

    const matchFilter =
      filter === 'all' ||
      reservation.status === filter;

    const matchSearch =
      !keyword ||
      reservationId.includes(keyword) ||
      reservationCode.includes(keyword) ||
      customerName.includes(keyword) ||
      customerPhone.includes(keyword) ||
      tableName.includes(keyword);

    return matchFilter && matchSearch;
  });

  const stats = {
    total: reservations.length,
    PENDING: reservations.filter(r => r.status === 'PENDING').length,
    CONFIRMED: reservations.filter(r => r.status === 'CONFIRMED').length,
    SEATED: reservations.filter(r => r.status === 'SEATED').length,
    COMPLETED: reservations.filter(r => r.status === 'COMPLETED').length,
    CANCELLED: reservations.filter(r => r.status === 'CANCELLED').length,
    NO_SHOW: reservations.filter(r => r.status === 'NO_SHOW').length
  };

  if (loading) {
    return (
      <div className="admin-reservations">
        <h1 className="page-title">Quản lý đặt bàn</h1>

        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          ⏳ Đang tải danh sách đặt bàn...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-reservations">
        <div className="page-header">
          <h1 className="page-title">Quản lý đặt bàn</h1>

          <button className="btn-primary" onClick={fetchReservations}>
            🔄 Thử lại
          </button>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: 40, color: '#dc2626' }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reservations">
      <div className="page-header">
        <h1 className="page-title">Quản lý đặt bàn</h1>

        <button className="btn-primary" onClick={fetchReservations}>
          🔄 Làm mới
        </button>
      </div>

      <div className="res-admin-stats">
        {[
          ['total', 'Tổng', '#e85d04'],
          ['PENDING', 'Chờ xác nhận', '#d69e2e'],
          ['CONFIRMED', 'Đã xác nhận', '#3182ce'],
          ['SEATED', 'Đã nhận bàn', '#38a169'],
          ['COMPLETED', 'Hoàn thành', '#16a34a'],
          ['CANCELLED', 'Đã hủy', '#e53e3e'],
          ['NO_SHOW', 'Không đến', '#64748b']
        ].map(([key, label, color]) => (
          <div
            key={key}
            className="res-stat-card"
            style={{ borderTopColor: color }}
            onClick={() => setFilter(key === 'total' ? 'all' : key)}
          >
            <span className="res-stat-num" style={{ color }}>
              {stats[key]}
            </span>

            <span className="res-stat-label">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="res-toolbar">
        <input
          className="search-input"
          placeholder="🔍 Tìm tên, SĐT, mã đặt bàn, bàn..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="filter-tabs">
          {filterOptions.map(([value, label]) => (
            <button
              key={value}
              className={`filter-tab ${filter === value ? 'active' : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="res-admin-list">
        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: '#a0aec0' }}>
            Không có đặt bàn nào
          </div>
        )}

        {filtered.map(reservation => {
          const reservationId = getReservationId(reservation);
          const reservationCode = getReservationCode(reservation);
          const customerName = getCustomerName(reservation);
          const customerPhone = getCustomerPhone(reservation);
          const guests = getGuestCount(reservation);
          const tableName = getTableName(reservation);
          const note = getNote(reservation);
          const items = getReservationItems(reservation);
          const statusInfo = getStatusInfo(reservation.status);
          const isExpanded = expanded === reservationId;

          return (
            <div key={reservationId} className="res-admin-card card">
              <div
                className="res-admin-row"
                onClick={() => setExpanded(isExpanded ? null : reservationId)}
              >
                <div className="res-col-id">
                  <span className="res-admin-id">
                    {reservationCode}
                  </span>

                  <span className={`res-status-badge ${statusInfo.cls}`}>
                    {statusInfo.icon} {statusInfo.label}
                  </span>
                </div>

                <div className="res-col-guest">
                  <strong>{customerName}</strong>
                  <span>{customerPhone || 'Chưa có SĐT'}</span>
                </div>

                <div className="res-col-time">
                  <span>📅 {getReservationDate(reservation)}</span>
                  <span>🕐 {getReservationTime(reservation)}</span>
                </div>

                <div className="res-col-info">
                  <span>👥 {guests} người</span>

                  {tableName && (
                    <span>🪑 {tableName}</span>
                  )}

                  {items.length > 0 && (
                    <span className="preorder-tag">
                      🍽️ {items.length} món
                    </span>
                  )}
                </div>

                <span className="expand-arrow">
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>

              {isExpanded && (
                <div className="res-admin-detail">
                  {note && (
                    <div className="res-note">
                      📝 {note}
                    </div>
                  )}

                  {items.length > 0 && (
                    <div className="res-preorder-section">
                      <h4>🍽️ Món đặt trước</h4>

                      {items.map((item, index) => (
                        <div key={index} className="preorder-item-row">
                          <span>
                            {getItemName(item)} × {getItemQty(item)}
                          </span>

                          <span>
                            {(getItemPrice(item) * getItemQty(item)).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      ))}

                      <div className="preorder-total-row">
                        <span>Tổng dự kiến</span>
                        <strong>
                          {preOrderTotal(items).toLocaleString('vi-VN')}đ
                        </strong>
                      </div>
                    </div>
                  )}

                  {items.length === 0 && (
                    <div className="res-note">
                      Không có món đặt trước.
                    </div>
                  )}

                  <div className="res-admin-actions">
                    {reservation.status === 'PENDING' && (
                      <>
                        <button
                          className="action-btn confirm-btn"
                          onClick={() => updateReservationStatus(reservationId, 'CONFIRMED')}
                        >
                          ✅ Xác nhận
                        </button>

                        <button
                          className="action-btn cancel-btn"
                          onClick={() => updateReservationStatus(reservationId, 'CANCELLED')}
                        >
                          ❌ Hủy đặt bàn
                        </button>
                      </>
                    )}

                    {reservation.status === 'CONFIRMED' && (
                      <>
                        <button
                          className="action-btn checkin-btn"
                          onClick={() => updateReservationStatus(reservationId, 'SEATED')}
                        >
                          🪑 Khách đã nhận bàn
                        </button>

                        <button
                          className="action-btn cancel-btn"
                          onClick={() => updateReservationStatus(reservationId, 'CANCELLED')}
                        >
                          ❌ Hủy
                        </button>

                        <button
                          className="action-btn undo-btn"
                          onClick={() => updateReservationStatus(reservationId, 'NO_SHOW')}
                        >
                          🚫 Không đến
                        </button>
                      </>
                    )}

                    {reservation.status === 'SEATED' && (
                      <button
                        className="action-btn confirm-btn"
                        onClick={() => updateReservationStatus(reservationId, 'COMPLETED')}
                      >
                        🏁 Hoàn thành
                      </button>
                    )}

                    {['CANCELLED', 'NO_SHOW'].includes(reservation.status) && (
                      <button
                        className="action-btn undo-btn"
                        onClick={() => updateReservationStatus(reservationId, 'PENDING')}
                      >
                        ↩ Chuyển về chờ xác nhận
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminReservations;