
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

const PAYMENT_METHODS = [
  { id: 'cod', icon: '💵', label: 'Tiền mặt tại bàn' },
  { id: 'qr',  icon: '📱', label: 'Quét mã QR' },
];

function Cart() {
  const { items, updateQty, removeItem, totalPrice, clearCart } = useCart();
  const { applyVoucher, activeVoucher, clearVoucher, useVoucher, addSpend } = useProfile();
  const { user } = useAuth();

  const navigate = useNavigate();

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMsg, setVoucherMsg] = useState(null);
  const [step, setStep] = useState('cart'); // cart | success
  const [orderNote, setOrderNote] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  const serviceFee = Math.round(totalPrice * 0.05);

  const discount = activeVoucher
    ? activeVoucher.type === 'percent'
      ? Math.round((totalPrice + serviceFee) * activeVoucher.discount / 100)
      : activeVoucher.discount
    : 0;

  const finalTotal = totalPrice + serviceFee - discount;

  const getItemId = (item) => {
    return item.foodId || item.id;
  };

  const getItemName = (item) => {
    return item.foodName || item.name || item.title || 'Món ăn';
  };

  const getItemImage = (item) => {
    return item.img || item.emoji || '🍽️';
  };

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

  const buildOrderItems = () => {
    return items.map((item) => ({
      foodId: getItemId(item),
      quantity: item.qty
    }));
  };

  const handleApplyVoucher = () => {
    const result = applyVoucher(voucherInput);

    setVoucherMsg({
      success: result.success,
      text: result.success
        ? `✅ Áp dụng ${result.voucher.label} thành công!`
        : `❌ ${result.message}`,
    });

    setTimeout(() => setVoucherMsg(null), 3000);
  };

  const handleOrder = async () => {
    setOrderError('');

    if (!user?.userId) {
      setOrderError('Bạn cần đăng nhập để đặt hàng');
      return;
    }

    if (items.length === 0) {
      setOrderError('Giỏ hàng đang trống');
      return;
    }

    const orderItems = buildOrderItems();
    const invalidItem = orderItems.find((item) => !item.foodId || item.quantity <= 0);

    if (invalidItem) {
      setOrderError('Giỏ hàng có món không hợp lệ');
      return;
    }

    setOrderLoading(true);

    try {
      const noteParts = [];
      if (orderNote.trim()) noteParts.push(orderNote.trim());
      if (activeVoucher) noteParts.push(`Voucher: ${activeVoucher.code}`);

      const response = await API.post('/orders', {
        userId: user.userId,
        note: noteParts.join(' | '),
        items: orderItems
      });

      if (activeVoucher) useVoucher(activeVoucher.code);
      addSpend(finalTotal);
      clearCart();

      setCreatedOrder(response.data);
      setStep('success');
    } catch (error) {
      console.error('Create order error:', error);
      setOrderError(
        getApiMessage(error.response?.data, 'Không thể đặt hàng. Vui lòng thử lại.')
      );
    } finally {
      setOrderLoading(false);
    }
  };

  // ── Empty cart ──────────────────────────────────────────
  if (items.length === 0 && step === 'cart') {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>Giỏ hàng trống</h2>
        <p>Hãy thêm món ăn vào giỏ hàng</p>

        <button className="btn-primary" onClick={() => navigate('/customer/menu')}>
          Xem thực đơn
        </button>
      </div>
    );
  }

  // ── Success screen ──────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="order-success">
        <div className="success-anim">✅</div>
        <h2>Đặt món thành công!</h2>
        <p>Cảm ơn bạn đã đặt món tại <strong>Cái Gì Cũng Không Có</strong></p>
        <div className="success-info-box">
          {createdOrder?.orderCode && (
            <div className="success-row">
              <span>🧾 Mã đơn</span>
              <strong>{createdOrder.orderCode}</strong>
            </div>
          )}
          <div className="success-row">
            <span>💰 Tổng tiền</span>
            <strong style={{ color: '#e85d04' }}>
              {(createdOrder?.totalAmount || finalTotal).toLocaleString('vi-VN')}đ
            </strong>
          </div>
          <div className="success-row">
            <span>⏱ Thời gian chờ</span>
            <strong>~20-30 phút</strong>
          </div>
        </div>
        <p className="success-note">
          🔔 Nhân viên sẽ phục vụ bạn sớm nhất. Khi muốn thanh toán, vào mục <strong>Đơn hàng</strong> để thanh toán.
        </p>
        <div className="success-btns">
          <button className="btn-primary" onClick={() => navigate('/customer/orders')}>
            📋 Xem đơn hàng
          </button>
          <button className="btn-secondary" onClick={() => navigate('/customer/menu')}>
            🍽️ Đặt thêm
          </button>
        </div>
      </div>
    );
  }

  // ── Cart step ───────────────────────────────────────────
  return (
    <div className="cart-page">
      <h1 className="page-title">Giỏ hàng</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={getItemId(item)} className="cart-item card">
              <div className="cart-item-img">{getItemImage(item)}</div>

              <div className="cart-item-info">
                <h3>{getItemName(item)}</h3>

                <p className="cart-item-price">
                  {item.price.toLocaleString('vi-VN')}đ
                </p>
              </div>

              <div className="cart-qty">
                <button onClick={() => updateQty(getItemId(item), item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(getItemId(item), item.qty + 1)}>+</button>
              </div>

              <div className="cart-item-total">
                {(item.price * item.qty).toLocaleString('vi-VN')}đ
              </div>

              <button className="cart-remove" onClick={() => removeItem(getItemId(item))}>
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <h2>Tóm tắt đơn hàng</h2>

          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
          </div>

          <div className="summary-row">
            <span>Phí dịch vụ (5%)</span>
            <span>{serviceFee.toLocaleString('vi-VN')}đ</span>
          </div>

          {activeVoucher && (
            <div className="summary-row discount-row">
              <span>🎁 Voucher ({activeVoucher.code})</span>
              <span className="discount-val">-{discount.toLocaleString('vi-VN')}đ</span>
            </div>
          )}

          <div className="summary-divider"></div>

          <div className="summary-row summary-total">
            <span>Tổng cộng</span>
            <span>{finalTotal.toLocaleString('vi-VN')}đ</span>
          </div>

          <div className="coupon-row">
            <input
              className="coupon-input"
              placeholder="Nhập mã voucher..."
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
            />

            <button className="coupon-btn" onClick={handleApplyVoucher}>
              Áp dụng
            </button>
          </div>

          {voucherMsg && (
            <p className={`voucher-msg ${voucherMsg.success ? 'success' : 'error'}`}>
              {voucherMsg.text}
            </p>
          )}

          {activeVoucher && (
            <button className="clear-voucher" onClick={clearVoucher}>
              ✕ Bỏ voucher {activeVoucher.code}
            </button>
          )}

          <div className="form-group" style={{ marginTop: 8 }}>
            <label className="form-label">📝 Ghi chú</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm..."
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
            />
          </div>

          {orderError && <p className="voucher-msg error">❌ {orderError}</p>}

          <button className="order-btn" onClick={handleOrder} disabled={orderLoading}>
            {orderLoading ? 'Đang đặt món...' : '🍽️ Đặt món ngay'}
          </button>

          <button className="back-btn" onClick={() => navigate('/customer/menu')}>
            ← Tiếp tục mua
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;

