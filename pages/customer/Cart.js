import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProfile } from '../../context/ProfileContext';
import './Cart.css';

const PAYMENT_METHODS = [
  { id: 'cod',    icon: '💵', label: 'Thanh toán tại bàn' },
  { id: 'card',   icon: '💳', label: 'Thẻ tín dụng / Ghi nợ' },
  { id: 'momo',   icon: '🟣', label: 'Ví MoMo' },
  { id: 'zalopay',icon: '🔵', label: 'ZaloPay' },
  { id: 'vnpay',  icon: '🔴', label: 'VNPay QR' },
];

function Cart() {
  const { items, updateQty, removeItem, totalPrice, clearCart } = useCart();
  const { applyVoucher, activeVoucher, clearVoucher, useVoucher, addSpend } = useProfile();
  const navigate = useNavigate();

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMsg, setVoucherMsg]     = useState(null);
  const [payMethod, setPayMethod]       = useState('cod');
  const [step, setStep]                 = useState('cart'); // cart | payment | success
  const [orderNote, setOrderNote]       = useState('');

  const serviceFee = Math.round(totalPrice * 0.05);
  const discount = activeVoucher
    ? activeVoucher.type === 'percent'
      ? Math.round((totalPrice + serviceFee) * activeVoucher.discount / 100)
      : activeVoucher.discount
    : 0;
  const finalTotal = totalPrice + serviceFee - discount;

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

  const handleOrder = () => {
    if (activeVoucher) useVoucher(activeVoucher.code);
    addSpend(finalTotal);
    clearCart();
    setStep('success');
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
    const method = PAYMENT_METHODS.find(m => m.id === payMethod);
    return (
      <div className="order-success">
        <div className="success-anim">✅</div>
        <h2>Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã đặt món tại <strong>Cái Gì Cũng Không Có</strong></p>
        <div className="success-info-box">
          <div className="success-row">
            <span>💳 Thanh toán</span>
            <strong>{method?.icon} {method?.label}</strong>
          </div>
          <div className="success-row">
            <span>💰 Tổng tiền</span>
            <strong style={{color:'#e85d04'}}>{finalTotal.toLocaleString('vi-VN')}đ</strong>
          </div>
          <div className="success-row">
            <span>⏱ Thời gian chờ</span>
            <strong>~20-30 phút</strong>
          </div>
        </div>
        <p className="success-note">
          🔔 Nhân viên sẽ phục vụ bạn sớm nhất. Bạn có thể theo dõi đơn hàng tại mục <strong>Đơn hàng</strong>.
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

  // ── Payment step ────────────────────────────────────────
  if (step === 'payment') {
    return (
      <div className="cart-page">
        <div className="cart-step-header">
          <button className="back-step-btn" onClick={() => setStep('cart')}>← Quay lại</button>
          <h1 className="page-title">Thanh toán</h1>
        </div>

        <div className="cart-layout">
          <div className="payment-section card">
            <h3>Chọn phương thức thanh toán</h3>
            <div className="payment-methods">
              {PAYMENT_METHODS.map(m => (
                <label key={m.id} className={`payment-option ${payMethod === m.id ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value={m.id}
                    checked={payMethod === m.id}
                    onChange={() => setPayMethod(m.id)} />
                  <span className="pay-icon">{m.icon}</span>
                  <span className="pay-label">{m.label}</span>
                  {payMethod === m.id && <span className="pay-check">✓</span>}
                </label>
              ))}
            </div>

            {(payMethod === 'card') && (
              <div className="card-form">
                <div className="form-group">
                  <label className="form-label">Số thẻ</label>
                  <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19} />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Ngày hết hạn</label>
                    <input className="form-input" placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input className="form-input" placeholder="123" maxLength={3} type="password" />
                  </div>
                </div>
              </div>
            )}

            {(payMethod === 'momo' || payMethod === 'zalopay' || payMethod === 'vnpay') && (
              <div className="qr-placeholder">
                <div className="qr-box">
                  <div className="qr-mock">
                    <div className="qr-inner">QR</div>
                  </div>
                  <p>Quét mã QR bằng app {PAYMENT_METHODS.find(m=>m.id===payMethod)?.label}</p>
                  <p className="qr-amount">{finalTotal.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            )}

            <div className="form-group" style={{marginTop:16}}>
              <label className="form-label">📝 Ghi chú đơn hàng</label>
              <textarea className="form-input" rows={2}
                placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm..."
                value={orderNote} onChange={e => setOrderNote(e.target.value)} />
            </div>
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h2>Tóm tắt đơn hàng</h2>
            <div className="summary-items-mini">
              {items.map(item => (
                <div key={item.id} className="summary-mini-row">
                  <span>{item.name} × {item.qty}</span>
                  <span>{(item.price * item.qty).toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
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
                <span>🎁 {activeVoucher.code}</span>
                <span className="discount-val">-{discount.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>Tổng cộng</span>
              <span>{finalTotal.toLocaleString('vi-VN')}đ</span>
            </div>
            <button className="order-btn" onClick={handleOrder}>
              {payMethod === 'cod' ? '✅ Xác nhận đặt hàng' : '💳 Thanh toán ngay'}
            </button>
          </div>
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
          {items.map(item => (
            <div key={item.id} className="cart-item card">
              <div className="cart-item-img">{item.img}</div>
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">{item.price.toLocaleString('vi-VN')}đ</p>
              </div>
              <div className="cart-qty">
                <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
              <div className="cart-item-total">
                {(item.price * item.qty).toLocaleString('vi-VN')}đ
              </div>
              <button className="cart-remove" onClick={() => removeItem(item.id)}>🗑️</button>
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
            <input className="coupon-input" placeholder="Nhập mã voucher..."
              value={voucherInput}
              onChange={e => setVoucherInput(e.target.value.toUpperCase())} />
            <button className="coupon-btn" onClick={handleApplyVoucher}>Áp dụng</button>
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

          <button className="order-btn" onClick={() => setStep('payment')}>
            💳 Tiến hành thanh toán
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
