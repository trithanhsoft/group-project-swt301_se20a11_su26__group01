import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Reservation.css';

const TIME_SLOTS = [
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00'
];

function Reservation() {
  const { user } = useAuth();

  const [step, setStep] = useState(1); // 1: thông tin, 2: chọn món, 3: xác nhận
  const [form, setForm] = useState({
    date: '',
    time: '',
    guests: 2,
    name: user?.username || '',
    phone: '',
    email: user?.email || '',
    note: ''
  });

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState(['Tất cả']);
  const [preOrder, setPreOrder] = useState({}); // { foodId: qty }
  const [activeCat, setActiveCat] = useState('Tất cả');

  const [submitted, setSubmitted] = useState(false);
  const [createdReservation, setCreatedReservation] = useState(null);

  const [menuLoading, setMenuLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: prev.name || user?.username || '',
      email: prev.email || user?.email || ''
    }));
  }, [user]);

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

  const normalizeFood = (food) => {
    const categoryName =
      food.categoryName ||
      food.category?.categoryName ||
      food.category ||
      'Khác';

    return {
      id: food.foodId || food.id,
      foodId: food.foodId || food.id,
      name: food.foodName || food.name || food.title || 'Món ăn',
      foodName: food.foodName || food.name || food.title || 'Món ăn',
      category: categoryName,
      price: Number(food.price || 0),
      img: food.emoji || food.img || '🍽️',
      emoji: food.emoji || '',
      imageUrl: food.imageUrl || ''
    };
  };

  const fetchMenuData = async () => {
    setMenuLoading(true);
    setError('');

    try {
      const [foodsRes, categoriesRes] = await Promise.all([
        API.get('/foods'),
        API.get('/categories')
      ]);

      const normalizedFoods = (foodsRes.data || []).map(normalizeFood);
      setFoods(normalizedFoods);

      const categoryNames = (categoriesRes.data || [])
        .map((category) => category.categoryName || category.name)
        .filter(Boolean);

      if (categoryNames.length > 0) {
        setCategories(['Tất cả', ...categoryNames]);
      } else {
        const uniqueCategories = [
          ...new Set(normalizedFoods.map((food) => food.category).filter(Boolean))
        ];
        setCategories(['Tất cả', ...uniqueCategories]);
      }
    } catch (error) {
      console.error('Fetch reservation menu error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tải danh sách món ăn'
        )
      );
    } finally {
      setMenuLoading(false);
    }
  };

  const updateQty = (foodId, delta) => {
    setPreOrder((prev) => {
      const qty = (prev[foodId] || 0) + delta;

      if (qty <= 0) {
        const next = { ...prev };
        delete next[foodId];
        return next;
      }

      return {
        ...prev,
        [foodId]: qty
      };
    });
  };

  const orderedItems = foods.filter((food) => preOrder[food.foodId]);

  const preOrderTotal = orderedItems.reduce((sum, food) => {
    return sum + food.price * preOrder[food.foodId];
  }, 0);

  const filteredMenu =
    activeCat === 'Tất cả'
      ? foods
      : foods.filter((food) => food.category === activeCat);

  const resetForm = () => {
    setStep(1);
    setPreOrder({});
    setSubmitted(false);
    setCreatedReservation(null);
    setError('');

    setForm({
      date: '',
      time: '',
      guests: 2,
      name: user?.username || '',
      phone: '',
      email: user?.email || '',
      note: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.date || !form.time || !form.name.trim() || !form.phone.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin đặt bàn');
      return;
    }

    setStep(2);
  };

  const buildReservationItems = () => {
    return orderedItems.map((food) => ({
      foodId: food.foodId,
      quantity: preOrder[food.foodId]
    }));
  };

  const handleConfirm = async () => {
    setError('');

    if (!form.date || !form.time || !form.name.trim() || !form.phone.trim()) {
      setError('Vui lòng kiểm tra lại thông tin đặt bàn');
      setStep(1);
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await API.post('/reservations', {
        userId: user?.userId || null,
        reservationDate: form.date,
        reservationTime: form.time,
        numberOfGuests: Number(form.guests),
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        customerEmail: form.email?.trim() || user?.email || '',
        note: form.note?.trim() || '',
        items: buildReservationItems()
      });

      setCreatedReservation(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Create reservation error:', error);

      setError(
        getApiMessage(
          error.response?.data,
          'Không thể tạo đặt bàn. Vui lòng thử lại.'
        )
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="reservation-success">
        <div className="success-icon">🎉</div>

        <h2>Đặt bàn thành công!</h2>

        <p>Chúng tôi đã nhận được yêu cầu của bạn.</p>

        <div className="success-info">
          {createdReservation?.reservationCode && (
            <div className="info-row">
              <span>🧾 Mã đặt bàn:</span>
              <strong>{createdReservation.reservationCode}</strong>
            </div>
          )}

          <div className="info-row">
            <span>📌 Trạng thái:</span>
            <strong>{createdReservation?.status || 'PENDING'}</strong>
          </div>

          <div className="info-row">
            <span>📅 Ngày:</span>
            <strong>{createdReservation?.reservationDate || form.date}</strong>
          </div>

          <div className="info-row">
            <span>🕐 Giờ:</span>
            <strong>{createdReservation?.reservationTime || form.time}</strong>
          </div>

          <div className="info-row">
            <span>👥 Số người:</span>
            <strong>{createdReservation?.numberOfGuests || form.guests} người</strong>
          </div>

          <div className="info-row">
            <span>👤 Tên:</span>
            <strong>{createdReservation?.customerName || form.name}</strong>
          </div>

          {(createdReservation?.items?.length > 0 || orderedItems.length > 0) && (
            <div className="info-row">
              <span>🍽️ Pre-order:</span>
              <strong>
                {createdReservation?.items?.length || orderedItems.length} món
              </strong>
            </div>
          )}

          {createdReservation?.preOrderTotal > 0 && (
            <div className="info-row">
              <span>💰 Tổng món đặt trước:</span>
              <strong>
                {Number(createdReservation.preOrderTotal).toLocaleString('vi-VN')}đ
              </strong>
            </div>
          )}
        </div>

        <button className="btn-primary" onClick={resetForm}>
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

      <div className="res-steps">
        {['Thông tin', 'Chọn món', 'Xác nhận'].map((label, index) => (
          <div
            key={index}
            className={`res-step ${
              step === index + 1 ? 'active' : step > index + 1 ? 'done' : ''
            }`}
          >
            <div className="step-circle">
              {step > index + 1 ? '✓' : index + 1}
            </div>

            <span>{label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="card" style={{ padding: 14, marginBottom: 16, color: '#dc2626' }}>
          ⚠️ {error}
        </div>
      )}

      {step === 1 && (
        <div className="reservation-layout">
          <form className="reservation-form card" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">📅 Ngày đặt bàn</label>

                <input
                  type="date"
                  className="form-input"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">👥 Số người</label>

                <select
                  className="form-input"
                  value={form.guests}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      guests: Number(e.target.value)
                    })
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                    <option key={number} value={number}>
                      {number} người
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">🕐 Chọn giờ</label>

              <div className="time-slots">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`time-slot ${form.time === time ? 'active' : ''}`}
                    onClick={() =>
                      setForm({
                        ...form,
                        time
                      })
                    }
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">👤 Họ tên</label>

                <input
                  type="text"
                  className="form-input"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">📞 Số điện thoại</label>

                <input
                  type="tel"
                  className="form-input"
                  placeholder="09xx-xxx-xxx"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">📧 Email</label>

              <input
                type="email"
                className="form-input"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">📝 Ghi chú</label>

              <textarea
                className="form-input"
                rows={2}
                placeholder="Yêu cầu đặc biệt..."
                value={form.note}
                onChange={(e) =>
                  setForm({
                    ...form,
                    note: e.target.value
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="reserve-btn"
              disabled={!form.date || !form.time || !form.name || !form.phone}
            >
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

      {step === 2 && (
        <div className="preorder-step">
          <div className="preorder-layout">
            <div className="preorder-menu">
              <div className="preorder-cats">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`filter-tab ${activeCat === category ? 'active' : ''}`}
                    onClick={() => setActiveCat(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {menuLoading ? (
                <div className="card" style={{ padding: 20, textAlign: 'center' }}>
                  ⏳ Đang tải món ăn...
                </div>
              ) : (
                <div className="preorder-grid">
                  {filteredMenu.map((dish) => (
                    <div key={dish.foodId} className="preorder-dish card">
                      <div className="pd-img">{dish.img}</div>

                      <div className="pd-info">
                        <h4>{dish.name}</h4>
                        <p className="pd-cat">{dish.category}</p>
                        <p className="pd-price">
                          {dish.price.toLocaleString('vi-VN')}đ
                        </p>
                      </div>

                      <div className="pd-qty">
                        {preOrder[dish.foodId] ? (
                          <>
                            <button
                              className="qty-btn"
                              onClick={() => updateQty(dish.foodId, -1)}
                            >
                              −
                            </button>

                            <span>{preOrder[dish.foodId]}</span>

                            <button
                              className="qty-btn"
                              onClick={() => updateQty(dish.foodId, 1)}
                            >
                              +
                            </button>
                          </>
                        ) : (
                          <button
                            className="add-btn"
                            onClick={() => updateQty(dish.foodId, 1)}
                          >
                            + Thêm
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredMenu.length === 0 && (
                    <div className="card" style={{ padding: 20, textAlign: 'center' }}>
                      Không có món nào
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="preorder-summary card">
              <h3>🛒 Món đã chọn</h3>

              {orderedItems.length === 0 ? (
                <p className="no-items">
                  Chưa chọn món nào
                  <br />
                  <span>Bạn có thể bỏ qua bước này</span>
                </p>
              ) : (
                <div className="summary-items">
                  {orderedItems.map((item) => (
                    <div key={item.foodId} className="summary-item-row">
                      <span>
                        {item.img} {item.name}
                      </span>

                      <span>×{preOrder[item.foodId]}</span>

                      <span>
                        {(item.price * preOrder[item.foodId]).toLocaleString('vi-VN')}đ
                      </span>
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

              <button className="back-link" onClick={() => setStep(1)}>
                ← Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="confirm-step">
          <div className="confirm-layout">
            <div className="confirm-card card">
              <h3>📋 Xác nhận đặt bàn</h3>

              <div className="confirm-section">
                <h4>Thông tin đặt bàn</h4>

                <div className="confirm-row">
                  <span>📅 Ngày</span>
                  <strong>{form.date}</strong>
                </div>

                <div className="confirm-row">
                  <span>🕐 Giờ</span>
                  <strong>{form.time}</strong>
                </div>

                <div className="confirm-row">
                  <span>👥 Số người</span>
                  <strong>{form.guests} người</strong>
                </div>

                <div className="confirm-row">
                  <span>👤 Tên</span>
                  <strong>{form.name}</strong>
                </div>

                <div className="confirm-row">
                  <span>📞 SĐT</span>
                  <strong>{form.phone}</strong>
                </div>

                {form.email && (
                  <div className="confirm-row">
                    <span>📧 Email</span>
                    <strong>{form.email}</strong>
                  </div>
                )}

                {form.note && (
                  <div className="confirm-row">
                    <span>📝 Ghi chú</span>
                    <strong>{form.note}</strong>
                  </div>
                )}
              </div>

              {orderedItems.length > 0 && (
                <div className="confirm-section">
                  <h4>Món đã đặt trước</h4>

                  {orderedItems.map((item) => (
                    <div key={item.foodId} className="confirm-row">
                      <span>
                        {item.img} {item.name} ×{preOrder[item.foodId]}
                      </span>

                      <strong>
                        {(item.price * preOrder[item.foodId]).toLocaleString('vi-VN')}đ
                      </strong>
                    </div>
                  ))}

                  <div className="confirm-row confirm-total">
                    <span>Tổng dự kiến</span>
                    <strong>{preOrderTotal.toLocaleString('vi-VN')}đ</strong>
                  </div>
                </div>
              )}

              {error && (
                <div className="card" style={{ padding: 12, marginBottom: 12, color: '#dc2626' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                className="reserve-btn"
                onClick={handleConfirm}
                disabled={submitLoading}
              >
                {submitLoading ? 'Đang lưu đặt bàn...' : '✅ Xác nhận đặt bàn'}
              </button>

              <button className="back-link" onClick={() => setStep(2)}>
                ← Quay lại chọn món
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reservation;