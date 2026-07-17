import React, { useEffect, useMemo, useState } from 'react';
import API from '../../services/api';
import './StaffPayments.css';

const METHOD_FILTERS = [
  ['all', 'Tất cả'],
  ['CASH', 'Tiền mặt'],
  ['QR', 'QR PayOS'],
];

const STATUS_FILTERS = [
  ['all', 'Tất cả'],
  ['PENDING', 'Đang chờ'],
  ['PAID', 'Đã thanh toán'],
  ['FAILED', 'Thất bại'],
  ['CANCELLED', 'Đã hủy'],
  ['REFUNDED', 'Hoàn tiền'],
];

const statusMap = {
  PENDING: {
    label: 'Đang chờ',
    className: 'pay-status-pending',
  },
  PAID: {
    label: 'Đã thanh toán',
    className: 'pay-status-paid',
  },
  FAILED: {
    label: 'Thất bại',
    className: 'pay-status-failed',
  },
  CANCELLED: {
    label: 'Đã hủy',
    className: 'pay-status-cancelled',
  },
  REFUNDED: {
    label: 'Hoàn tiền',
    className: 'pay-status-refunded',
  },
};

function StaffPayments() {
  const [payments, setPayments] = useState([]);
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
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

  const fetchPayments = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get('/payments');
      setPayments(response.data || []);
    } catch (error) {
      console.error('Fetch payments error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tải lịch sử thanh toán'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString('vi-VN');
  };

  const formatDateTime = (value) => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusInfo = (status) => {
    return (
      statusMap[status] || {
        label: status || 'Không xác định',
        className: 'pay-status-pending',
      }
    );
  };

  const filteredPayments = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchMethod =
        methodFilter === 'all' || payment.method === methodFilter;

      const matchStatus =
        statusFilter === 'all' || payment.status === statusFilter;

      const searchableText = [
        payment.paymentId,
        payment.orderId,
        payment.orderCode,
        payment.tableName,
        payment.customerName,
        payment.transactionCode,
        payment.payosOrderCode,
        payment.paymentLinkId,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchKeyword =
        !lowerKeyword || searchableText.includes(lowerKeyword);

      return matchMethod && matchStatus && matchKeyword;
    });
  }, [payments, methodFilter, statusFilter, keyword]);

  const totalPaidAmount = useMemo(() => {
    return filteredPayments
      .filter((payment) => payment.status === 'PAID')
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }, [filteredPayments]);

  const paidCount = filteredPayments.filter(
    (payment) => payment.status === 'PAID'
  ).length;

  const pendingCount = filteredPayments.filter(
    (payment) => payment.status === 'PENDING'
  ).length;

  if (loading) {
    return (
      <div className="staff-payments">
        <div className="page-header">
          <h1 className="page-title">Lịch sử thanh toán</h1>
        </div>

        <div className="payments-card empty-card">
          ⏳ Đang tải lịch sử thanh toán...
        </div>
      </div>
    );
  }

  return (
    <div className="staff-payments">
      <div className="page-header">
        <div>
          <h1 className="page-title">Lịch sử thanh toán</h1>
          <p className="payments-subtitle">
            Theo dõi các giao dịch tiền mặt và PayOS QR.
          </p>
        </div>

        <button className="btn-primary" onClick={fetchPayments}>
          🔄 Làm mới
        </button>
      </div>

      {error && (
        <div className="payments-card error-card">
          ⚠️ {error}
        </div>
      )}

      <div className="payment-summary-grid">
        <div className="payment-summary-card">
          <span className="summary-label">Tổng giao dịch</span>
          <strong>{filteredPayments.length}</strong>
        </div>

        <div className="payment-summary-card">
          <span className="summary-label">Đã thanh toán</span>
          <strong>{paidCount}</strong>
        </div>

        <div className="payment-summary-card">
          <span className="summary-label">Đang chờ</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="payment-summary-card">
          <span className="summary-label">Doanh thu đã nhận</span>
          <strong>{formatMoney(totalPaidAmount)}đ</strong>
        </div>
      </div>

      <div className="payments-card payments-filters">
        <div className="filter-group">
          <label>Phương thức</label>
          <div className="filter-buttons">
            {METHOD_FILTERS.map(([value, label]) => (
              <button
                key={value}
                className={methodFilter === value ? 'active' : ''}
                onClick={() => setMethodFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Trạng thái</label>
          <div className="filter-buttons">
            {STATUS_FILTERS.map(([value, label]) => (
              <button
                key={value}
                className={statusFilter === value ? 'active' : ''}
                onClick={() => setStatusFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group search-group">
          <label>Tìm kiếm</label>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm mã đơn, bàn, khách, mã giao dịch..."
          />
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="payments-card empty-card">
          📋 Không có giao dịch phù hợp
        </div>
      ) : (
        <div className="payments-table-card">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment</th>
                <th>Đơn hàng</th>
                <th>Bàn / Khách</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Số tiền</th>
                <th>Mã giao dịch</th>
                <th>Thời gian</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => {
                const statusInfo = getStatusInfo(payment.status);

                return (
                  <tr key={payment.paymentId}>
                    <td>
                      <strong>#{payment.paymentId}</strong>
                      {payment.payosOrderCode && (
                        <small>PayOS: {payment.payosOrderCode}</small>
                      )}
                    </td>

                    <td>
                      <strong>{payment.orderCode || `#${payment.orderId}`}</strong>
                      <small>Order ID: {payment.orderId}</small>
                    </td>

                    <td>
                      <strong>{payment.tableName || 'Không có bàn'}</strong>
                      <small>{payment.customerName || 'Khách vãng lai'}</small>
                    </td>

                    <td>
                      <span className={`method-badge method-${payment.method}`}>
                        {payment.method === 'QR' ? 'QR PayOS' : 'Tiền mặt'}
                      </span>
                    </td>

                    <td>
                      <span className={`payment-status ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </td>

                    <td>
                      <strong>{formatMoney(payment.amount)}đ</strong>
                    </td>

                    <td>
                      <span>{payment.transactionCode || '—'}</span>
                      {payment.paymentLinkId && (
                        <small>{payment.paymentLinkId}</small>
                      )}
                    </td>

                    <td>
                      <span>{formatDateTime(payment.paidAt)}</span>
                      <small>Tạo: {formatDateTime(payment.createdAt)}</small>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StaffPayments;