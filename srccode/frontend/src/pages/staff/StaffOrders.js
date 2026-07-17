import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import API from '../../services/api';
import './StaffOrders.css';

const statusFlow = {
  PENDING: 'CONFIRMED'
};

const statusMap = {
  PENDING: {
    label: 'Chờ xác nhận',
    cls: 'status-pending'
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    cls: 'status-serving'
  },
  PREPARING: {
    label: 'Đang chế biến',
    cls: 'status-serving'
  },
  READY: {
    label: 'Sẵn sàng phục vụ',
    cls: 'status-serving'
  },
  COMPLETED: {
    label: 'Hoàn thành',
    cls: 'status-done'
  },
  CANCELLED: {
    label: 'Đã hủy',
    cls: 'status-cancelled'
  }
};

const FILTERS = [
  ['all', 'Tất cả'],
  ['PENDING', 'Chờ xác nhận'],
  ['CONFIRMED', 'Đã xác nhận'],
  ['PREPARING', 'Đang chế biến'],
  ['READY', 'Sẵn sàng'],
  ['COMPLETED', 'Hoàn thành'],
  ['CANCELLED', 'Đã hủy']
];

function InvoiceModal({ order, onClose }) {
  const serviceFee = Math.round(Number(order.totalAmount || 0) * 0.05);
  const grandTotal = Number(order.totalAmount || 0) + serviceFee;

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString('vi-VN');
  };

  const formatDateTime = (value) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const customerDisplay =
    order.customerName ||
    order.username ||
    'Khách vãng lai';

  const tableDisplay =
    order.tableName ||
    (order.tableId ? `Bàn ${order.tableId}` : 'Không có bàn');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="invoice-modal card" onClick={(event) => event.stopPropagation()}>
        <div className="invoice-header">
          <h2>🍜 Cái Gì Cũng Không Có</h2>
          <p>123 Đường ABC, Quận 1, TP.HCM</p>
          <p>ĐT: 028-xxxx-xxxx</p>

          <div className="invoice-divider"></div>

          <h3>HÓA ĐƠN THANH TOÁN</h3>

          <p>
            Mã đơn: <strong>{order.orderCode || `#${order.orderId}`}</strong>
          </p>

          <p>
            Bàn: <strong>{tableDisplay}</strong>
          </p>

          <p>
            Khách hàng: <strong>{customerDisplay}</strong>
          </p>

          {order.customerPhone && (
            <p>
              SĐT: <strong>{order.customerPhone}</strong>
            </p>
          )}

          <p>{formatDateTime(order.createdAt)}</p>
        </div>

        <div className="invoice-divider"></div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Món</th>
              <th>SL</th>
              <th>Đơn giá</th>
              <th>T.Tiền</th>
            </tr>
          </thead>

          <tbody>
            {order.items?.map((item) => (
              <tr key={item.orderItemId}>
                <td>{item.foodName}</td>
                <td>{item.quantity}</td>
                <td>{formatMoney(item.unitPrice)}đ</td>
                <td>{formatMoney(item.subtotal)}đ</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-divider"></div>

        <div className="invoice-totals">
          <div className="inv-row">
            <span>Tạm tính</span>
            <span>{formatMoney(order.totalAmount)}đ</span>
          </div>

          <div className="inv-row">
            <span>Phí dịch vụ dự kiến (5%)</span>
            <span>{formatMoney(serviceFee)}đ</span>
          </div>

          <div className="inv-row inv-grand">
            <span>TỔNG CỘNG</span>
            <strong>{formatMoney(grandTotal)}đ</strong>
          </div>
        </div>

        {order.note && (
          <>
            <div className="invoice-divider"></div>
            <p>
              <strong>Ghi chú:</strong> {order.note}
            </p>
          </>
        )}

        <div className="invoice-divider"></div>

        <p className="invoice-thanks">Cảm ơn quý khách! Hẹn gặp lại 🙏</p>

        <div className="invoice-actions">
          <button className="print-real-btn" onClick={() => window.print()}>
            🖨️ In hóa đơn
          </button>

          <button className="modal-cancel" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({
  order,
  actionLoadingId,
  formatMoney,
  onClose,
  onPay,
  payosPayment,
  onOpenPayOS
}) {
  const isLoading = actionLoadingId === order.orderId;

  const tableDisplay =
    order.tableName ||
    (order.tableId ? `Bàn ${order.tableId}` : 'Không có bàn');

  const customerDisplay =
    order.customerName ||
    order.username ||
    'Khách vãng lai';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="invoice-modal card" onClick={(event) => event.stopPropagation()}>
        <div className="invoice-header">
          <h2>💳 Thanh toán đơn hàng</h2>

          <p>
            Mã đơn: <strong>{order.orderCode || `#${order.orderId}`}</strong>
          </p>

          <p>
            Bàn: <strong>{tableDisplay}</strong>
          </p>

          <p>
            Khách: <strong>{customerDisplay}</strong>
          </p>

          {order.customerPhone && (
            <p>
              SĐT: <strong>{order.customerPhone}</strong>
            </p>
          )}

          <p>
            Tổng tiền: <strong>{formatMoney(order.totalAmount)}đ</strong>
          </p>
        </div>

        <div className="invoice-divider"></div>

        {!payosPayment ? (
          <div className="invoice-actions">
            <button
              className="print-real-btn"
              disabled={isLoading}
              onClick={() => onPay(order, 'CASH')}
            >
              {isLoading ? 'Đang xử lý...' : '💵 Tiền mặt'}
            </button>

            <button
              className="print-real-btn"
              disabled={isLoading}
              onClick={() => onPay(order, 'QR')}
            >
              {isLoading ? 'Đang tạo QR...' : '📱 QR PayOS'}
            </button>

            <button
              className="modal-cancel"
              disabled={isLoading}
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        ) : (
          <div className="payos-qr-box">
            <h3>📱 Quét mã QR để thanh toán</h3>

            <div className="qr-wrapper">
              <QRCodeCanvas
                value={payosPayment.qrCode || payosPayment.checkoutUrl}
                size={250}
                includeMargin={true}
              />
            </div>

            <p className="qr-amount">
              Số tiền: <strong>{formatMoney(payosPayment.amount)}đ</strong>
            </p>

            <p className="qr-status">
              Trạng thái: <strong>{payosPayment.status}</strong>
            </p>

            <p className="qr-note">
              Sau khi khách thanh toán thành công, PayOS webhook sẽ tự cập nhật đơn hàng.
              Màn hình này sẽ tự kiểm tra trạng thái mỗi 3 giây.
            </p>

            <div className="invoice-actions">
              <button
                className="print-real-btn"
                onClick={onOpenPayOS}
              >
                Mở trang PayOS
              </button>

              <button
                className="modal-cancel"
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StaffOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  const [showInvoice, setShowInvoice] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [payosPayment, setPayosPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!payosPayment || !paymentOrder) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const response = await API.get(`/orders/${paymentOrder.orderId}`);
        const latestOrder = response.data;

        setOrders((prev) =>
          prev.map((item) =>
            item.orderId === latestOrder.orderId ? latestOrder : item
          )
        );

        if (latestOrder.status === 'COMPLETED') {
          alert('Thanh toán thành công. Đơn hàng đã hoàn thành.');

          setPaymentOrder(null);
          setPayosPayment(null);
          fetchOrders();
        }
      } catch (error) {
        console.error('Check payment status error:', error);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [payosPayment, paymentOrder]);

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

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await API.get('/orders');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Fetch staff orders error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tải danh sách đơn hàng'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setActionLoadingId(orderId);
    setError('');

    try {
      const response = await API.put(`/orders/${orderId}/status`, {
        status
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? response.data : order
        )
      );
    } catch (error) {
      console.error('Update order status error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể cập nhật trạng thái đơn hàng'
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const payOrder = async (order, method) => {
    setActionLoadingId(order.orderId);
    setError('');

    try {
      if (method === 'CASH') {
        await API.post(`/payments/orders/${order.orderId}`, {
          method: 'CASH',
          transactionCode: `CASH-${order.orderCode || order.orderId}`,
          note: 'Khách thanh toán tiền mặt tại quầy'
        });

        alert('Thanh toán tiền mặt thành công');

        setOrders((prev) =>
          prev.map((item) =>
            item.orderId === order.orderId
              ? {
                  ...item,
                  status: 'COMPLETED'
                }
              : item
          )
        );

        setPaymentOrder(null);
        setPayosPayment(null);
        fetchOrders();
        return;
      }

      if (method === 'QR') {
        const response = await API.post(`/payments/orders/${order.orderId}/payos`);
        const paymentData = response.data;

        if (!paymentData?.qrCode && !paymentData?.checkoutUrl) {
          alert('Không lấy được mã QR PayOS');
          return;
        }

        setPayosPayment(paymentData);

        alert(
          'Đã tạo mã QR PayOS. Khách quét QR để thanh toán. Sau khi PayOS xác nhận tiền vào tài khoản, đơn sẽ tự chuyển hoàn thành.'
        );
      }
    } catch (error) {
      console.error('Payment error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể thanh toán đơn hàng'
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const closePaymentModal = () => {
    setPaymentOrder(null);
    setPayosPayment(null);
  };

  const openPayOSPage = () => {
    if (payosPayment?.checkoutUrl) {
      window.open(payosPayment.checkoutUrl, '_blank');
    }
  };

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm('Bạn có chắc muốn hủy đơn này không?');

    if (!confirmCancel) {
      return;
    }

    setActionLoadingId(orderId);
    setError('');

    try {
      await API.delete(`/orders/${orderId}`);

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId
            ? {
                ...order,
                status: 'CANCELLED'
              }
            : order
        )
      );
    } catch (error) {
      console.error('Cancel order error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể hủy đơn hàng'
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString('vi-VN');
  };

  const formatTime = (value) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    return (
      statusMap[status] || {
        label: status || 'Không xác định',
        cls: 'status-pending'
      }
    );
  };

  const getActionLabel = (status) => {
    if (status === 'PENDING') {
      return '✓ Xác nhận';
    }

    return '✓ Cập nhật';
  };

  const getCustomerDisplay = (order) => {
    return order.customerName || order.username || 'Khách vãng lai';
  };

  const getTableDisplay = (order) => {
    return order.tableName || (order.tableId ? `Bàn ${order.tableId}` : 'Không có bàn');
  };

  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) {
    return (
      <div className="staff-orders">
        <div className="page-header">
          <h1 className="page-title">Đơn hàng</h1>
        </div>

        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          ⏳ Đang tải đơn hàng...
        </div>
      </div>
    );
  }

  return (
    <div className="staff-orders">
      <div className="page-header">
        <h1 className="page-title">Đơn hàng</h1>

        <button className="btn-primary" onClick={fetchOrders}>
          🔄 Làm mới
        </button>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 16 }}>
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
        <div className="card" style={{ padding: 16, marginBottom: 16, color: '#dc2626' }}>
          ⚠️ {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          📋 Không có đơn hàng nào
        </div>
      ) : (
        <div className="staff-orders-list">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const nextStatus = statusFlow[order.status];
            const isActionLoading = actionLoadingId === order.orderId;

            return (
              <div key={order.orderId} className="staff-order-card card">
                <div className="sorder-left">
                  <span className="sorder-id">
                    {order.orderCode || `#${order.orderId}`}
                  </span>

                  <span className="sorder-table">
                    🪑 {getTableDisplay(order)}
                  </span>

                  <span className="sorder-table">
                    👤 {getCustomerDisplay(order)}
                  </span>

                  {order.customerPhone && (
                    <span className="sorder-waiter">
                      📞 {order.customerPhone}
                    </span>
                  )}

                  <span className="sorder-time">
                    🕐 {formatTime(order.createdAt)}
                  </span>

                  {order.email && (
                    <span className="sorder-waiter">
                      ✉️ {order.email}
                    </span>
                  )}
                </div>

                <div className="sorder-items">
                  {order.items?.map((item) => (
                    <span key={item.orderItemId} className="sorder-tag">
                      {item.emoji ? `${item.emoji} ` : ''}
                      {item.foodName} × {item.quantity}
                    </span>
                  ))}

                  {order.note && (
                    <span className="sorder-tag">
                      📝 {order.note}
                    </span>
                  )}
                </div>

                <div className="sorder-right">
                  <span className="sorder-total">
                    {formatMoney(order.totalAmount)}đ
                  </span>

                  <span className={`status-badge ${statusInfo.cls}`}>
                    {statusInfo.label}
                  </span>

                  <div className="sorder-actions">
                    {nextStatus && (
                      <button
                        className="advance-btn"
                        disabled={isActionLoading}
                        onClick={() => updateOrderStatus(order.orderId, nextStatus)}
                      >
                        {isActionLoading ? 'Đang xử lý...' : getActionLabel(order.status)}
                      </button>
                    )}

                    {order.status === 'READY' && (
                      <button
                        className="advance-btn"
                        disabled={isActionLoading}
                        onClick={() => {
                          setPaymentOrder(order);
                          setPayosPayment(null);
                        }}
                      >
                        💳 Thanh toán
                      </button>
                    )}

                    {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                      <button
                        className="cancel-order-btn"
                        disabled={isActionLoading}
                        onClick={() => cancelOrder(order.orderId)}
                      >
                        ✕
                      </button>
                    )}

                    <button
                      className="print-btn"
                      onClick={() => setShowInvoice(order)}
                    >
                      🖨️ In HĐ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showInvoice && (
        <InvoiceModal
          order={showInvoice}
          onClose={() => setShowInvoice(null)}
        />
      )}

      {paymentOrder && (
        <PaymentModal
          order={paymentOrder}
          actionLoadingId={actionLoadingId}
          formatMoney={formatMoney}
          onClose={closePaymentModal}
          onPay={payOrder}
          payosPayment={payosPayment}
          onOpenPayOS={openPayOSPage}
        />
      )}
    </div>
  );
}

export default StaffOrders;