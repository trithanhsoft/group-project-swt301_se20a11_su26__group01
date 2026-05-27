import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './QRModal.css';

/**
 * QRModal — dùng chung cho QR menu và QR thanh toán
 * Props:
 *   type: 'menu' | 'payment'
 *   value: string (URL hoặc payment info)
 *   amount: number (chỉ dùng cho payment)
 *   onClose: function
 */
function QRModal({ type, value, amount, onClose }) {
  const isPayment = type === 'payment';

  return (
    <div className="qr-overlay" onClick={onClose}>
      <div className="qr-modal card" onClick={e => e.stopPropagation()}>
        <button className="qr-close" onClick={onClose}>✕</button>

        <div className="qr-header">
          <span className="qr-icon">{isPayment ? '💳' : '🍽️'}</span>
          <h2>{isPayment ? 'QR Thanh toán' : 'QR Menu'}</h2>
          <p>{isPayment ? 'Quét để thanh toán' : 'Quét để xem thực đơn'}</p>
        </div>

        <div className="qr-code-wrap">
          <QRCodeSVG
            value={value}
            size={200}
            bgColor="#ffffff"
            fgColor="#1a1a2e"
            level="H"
            includeMargin={true}
          />
        </div>

        {isPayment && amount && (
          <div className="qr-amount-box">
            <p className="qr-amount-label">Số tiền thanh toán</p>
            <p className="qr-amount-val">{amount.toLocaleString('vi-VN')}đ</p>
          </div>
        )}

        <p className="qr-hint">
          {isPayment
            ? 'Mở app ngân hàng / ví điện tử và quét mã QR'
            : 'Mở camera điện thoại và quét mã QR để xem menu'}
        </p>

        <button className="qr-download-btn" onClick={() => {
          const svg = document.querySelector('.qr-code-wrap svg');
          if (!svg) return;
          const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
          const url  = URL.createObjectURL(blob);
          const a    = document.createElement('a');
          a.href = url; a.download = `qr-${type}.svg`; a.click();
          URL.revokeObjectURL(url);
        }}>
          ⬇️ Tải QR Code
        </button>
      </div>
    </div>
  );
}

export default QRModal;
