import React, { useState } from 'react';
import { MENU_ITEMS, MENU_CATEGORIES } from '../../data/menuData';
import './Reservation.css';

const MENU = MENU_ITEMS;
const CATEGORIES = MENU_CATEGORIES;
const TIME_SLOTS = ['11:00','11:30','12:00','12:30','13:00','17:00','17:30','18:00','18:30','19:00','19:30','20:00'];

function Reservation() {
  const [step, setStep] = useState(1); // 1: thông tin, 2: chọn món, 3: xác nhận
  const [form, setForm] = useState({ date: '', time: '', guests: 2, name: '', phone: '', note: '' });
  const [preOrder, setPreOrder] = useState({}); // { id: qty }
  const [activeCat, setActiveCat] = useState('Tất cả');
  const [submitted, setSubmitted] = useState(false);

  const updateQty = (id, delta) => {
    setPreOrder(prev => {
      const qty = (prev[id] || 0) + delta;
      if (qty <= 0) { const next = { ...prev }; delete next[id]; return next; }
      return { ...prev, [id]: qty };
    });
  };

  const orderedItems = MENU.filter(m => preOrder[m.id]);
  const preOrderTotal = orderedItems.reduce((sum, m) => sum + m.price * preOrder[m.id], 0);
  const filteredMenu = activeCat === 'Tất cả' ? MENU : MENU.filter(m => m.category === activeCat);

  const handleSubmit = (e) => { e.preventDefault(); setStep(2); };

  const handleConfirm = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="reservation-success">
        <div className="success-icon">🎉</div>
        <h2>Đặt bàn thành công!</h2>
        <p>Chúng tôi đã nhận được yêu cầu của bạn.</p>
        <div className="success-info">
          <div className="info-row"><span>📅 Ngày:</span><strong>{form.date}</strong></div>
          <div className="info-row"><span>🕐 Giờ:</span><strong>{form.time}</strong></div>
          <div className="info-row"><span>👥 Số người:</span><strong>{form.guests} người</strong></div>
          <div className="info-row"><span>👤 Tên:</span><strong>{form.name}</strong></div>
          {orderedItems.length > 0 && (
            <div className="info-row"><span>🍽️ Pre-order:</span><strong>{orderedItems.length} món</strong></div>
          )}
        </div>
        <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(1); setPreOrder({}); setForm({ date:'',time:'',guests:2,name:'',phone:'',note:'' }); }}>
          Đặt bàn khác
        </button>
      </div>
    );
  }

  return (
    <div className="reservation-page">
      <div className="reservation-header">
        <h1>Đặt bàn trước</h1>
        <p>Đặt bàn và chọn món trước để trải nghiệm tốt hơn</p>
      </div>

      {/* Step indicator */}
      <div className="res-steps">
        {['Thông tin', 'Chọn món', 'Xác nhận'].map((s, i) => (
          <div key={i} className={`res-step ${step === i+1 ? 'active' : step > i+1 ? 'done' : ''}`}>
            <div className="step-circle">{step > i+1 ? '✓' : i+1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Thông tin */}
      {step === 1 && (
        <div className="reservation-layout">
          <form className="reservation-form card" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">📅 Ngày đặt bàn</label>
                <input type="date" className="form-input"
                  value={form.date} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">👥 Số người</label>
                <select className="form-input" value={form.guests}
                  onChange={e => setForm({ ...form, guests: e.target.value })}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} người</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">🕐 Chọn giờ</label>
              <div className="time-slots">
                {TIME_SLOTS.map(t => (
                  <button key={t} type="button"
                    className={`time-slot ${form.time === t ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, time: t })}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">👤 Họ tên</label>
                <input type="text" className="form-input" placeholder="Nguyễn Văn A"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">📞 Số điện thoại</label>
                <input type="tel" className="form-input" placeholder="09xx-xxx-xxx"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">📝 Ghi chú</label>
              <textarea className="form-input" rows={2} placeholder="Yêu cầu đặc biệt..."
                value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
            </div>

            <button type="submit" className="reserve-btn" disabled={!form.date || !form.time}>
              Tiếp theo: Chọn món →
            </button>
          </form>

          <div className="reservation-info">
            <div className="info-card card">
              <h3>📍 Thông tin nhà hàng</h3>
              <p>🏠 123 Đường ABC, Quận 1, TP.HCM</p>
              <p>📞 028-xxxx-xxxx</p>
              <p>🕐 Mở cửa: 10:00 - 22:00</p>
            </div>
            <div className="info-card card">
              <h3>📋 Lưu ý</h3>
              <ul>
                <li>Vui lòng đến đúng giờ đã đặt</li>
                <li>Bàn giữ trong 15 phút</li>
                <li>Liên hệ trước nếu cần hủy</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Chọn món */}
      {step === 2 && (
        <div className="preorder-step">
          <div className="preorder-layout">
            <div className="preorder-menu">
              <div className="preorder-cats">
                {CATEGORIES.map(cat => (
                  <button key={cat} className={`filter-tab ${activeCat === cat ? 'active' : ''}`}
                    onClick={() => setActiveCat(cat)}>{cat}</button>
                ))}
              </div>

              <div className="preorder-grid">
                {filteredMenu.map(dish => (
                  <div key={dish.id} className="preorder-dish card">
                    <div className="pd-img">{dish.img}</div>
                    <div className="pd-info">
                      <h4>{dish.name}</h4>
                      <p className="pd-cat">{dish.category}</p>
                      <p className="pd-price">{dish.price.toLocaleString('vi-VN')}đ</p>
                    </div>
                    <div className="pd-qty">
                      {preOrder[dish.id] ? (
                        <>
                          <button className="qty-btn" onClick={() => updateQty(dish.id, -1)}>−</button>
                          <span>{preOrder[dish.id]}</span>
                          <button className="qty-btn" onClick={() => updateQty(dish.id, 1)}>+</button>
                        </>
                      ) : (
                        <button className="add-btn" onClick={() => updateQty(dish.id, 1)}>+ Thêm</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary sidebar */}
            <div className="preorder-summary card">
              <h3>🛒 Món đã chọn</h3>
              {orderedItems.length === 0 ? (
                <p className="no-items">Chưa chọn món nào<br/><span>Bạn có thể bỏ qua bước này</span></p>
              ) : (
                <div className="summary-items">
                  {orderedItems.map(item => (
                    <div key={item.id} className="summary-item-row">
                      <span>{item.img} {item.name}</span>
                      <span>×{preOrder[item.id]}</span>
                      <span>{(item.price * preOrder[item.id]).toLocaleString('vi-VN')}đ</span>
                    </div>
                  ))}
                  <div className="summary-total-row">
                    <span>Tổng dự kiến</span>
                    <strong>{preOrderTotal.toLocaleString('vi-VN')}đ</strong>
                  </div>
                </div>
              )}
              <button className="reserve-btn" onClick={() => setStep(3)}>
                Tiếp theo: Xác nhận →
              </button>
              <button className="back-link" onClick={() => setStep(1)}>← Quay lại</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Xác nhận */}
      {step === 3 && (
        <div className="confirm-step">
          <div className="confirm-layout">
            <div className="confirm-card card">
              <h3>📋 Xác nhận đặt bàn</h3>

              <div className="confirm-section">
                <h4>Thông tin đặt bàn</h4>
                <div className="confirm-row"><span>📅 Ngày</span><strong>{form.date}</strong></div>
                <div className="confirm-row"><span>🕐 Giờ</span><strong>{form.time}</strong></div>
                <div className="confirm-row"><span>👥 Số người</span><strong>{form.guests} người</strong></div>
                <div className="confirm-row"><span>👤 Tên</span><strong>{form.name}</strong></div>
                <div className="confirm-row"><span>📞 SĐT</span><strong>{form.phone}</strong></div>
                {form.note && <div className="confirm-row"><span>📝 Ghi chú</span><strong>{form.note}</strong></div>}
              </div>

              {orderedItems.length > 0 && (
                <div className="confirm-section">
                  <h4>Món đã đặt trước</h4>
                  {orderedItems.map(item => (
                    <div key={item.id} className="confirm-row">
                      <span>{item.img} {item.name} ×{preOrder[item.id]}</span>
                      <strong>{(item.price * preOrder[item.id]).toLocaleString('vi-VN')}đ</strong>
                    </div>
                  ))}
                  <div className="confirm-row confirm-total">
                    <span>Tổng dự kiến</span>
                    <strong>{preOrderTotal.toLocaleString('vi-VN')}đ</strong>
                  </div>
                </div>
              )}

              <button className="reserve-btn" onClick={handleConfirm}>✅ Xác nhận đặt bàn</button>
              <button className="back-link" onClick={() => setStep(2)}>← Quay lại chọn món</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reservation;
