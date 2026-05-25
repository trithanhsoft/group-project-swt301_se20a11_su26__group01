import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { useProfile } from '../../context/ProfileContext';
import './Feedback.css';

const DISHES = [
  'Súp bào ngư vi cá', 'Gỏi tôm hùm xoài xanh', 'Chả giò hải sản',
  'Bò Wagyu nướng than hoa', 'Tôm hùm hấp bia', 'Cá hồi áp chảo sốt chanh',
  'Vịt quay Bắc Kinh', 'Sườn bò hầm rượu vang', 'Khoai tây nghiền truffle',
  'Bánh soufflé socola', 'Crème brûlée vani', 'Cocktail Signature',
];

function StarRating({ value, onChange, size = 'md' }) {
  const [hover, setHover] = useState(0);
  return (
    <div className={`star-row star-${size}`}>
      {[1,2,3,4,5].map(n => (
        <button
          key={n} type="button"
          className={`star ${n <= (hover || value) ? 'filled' : ''}`}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(n)}
        >★</button>
      ))}
    </div>
  );
}

function Feedback() {
  const { addFeedback, feedbacks } = useFeedback();
  const { profile } = useProfile();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    overallRating: 0, foodRating: 0, serviceRating: 0, ambianceRating: 0,
    comment: '', dishes: [], orderId: '',
  });

  const toggleDish = (dish) => {
    setForm(prev => ({
      ...prev,
      dishes: prev.dishes.includes(dish)
        ? prev.dishes.filter(d => d !== dish)
        : [...prev.dishes, dish],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.overallRating === 0) return;
    addFeedback({ ...form, name: profile.name });
    setSubmitted(true);
  };

  // Feedbacks của user này
  const myFeedbacks = feedbacks.filter(f => f.name === profile.name);

  if (submitted) {
    return (
      <div className="feedback-success">
        <div className="fb-success-icon">🙏</div>
        <h2>Cảm ơn bạn đã đánh giá!</h2>
        <p>Phản hồi của bạn giúp chúng tôi cải thiện dịch vụ mỗi ngày.</p>
        <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ overallRating:0, foodRating:0, serviceRating:0, ambianceRating:0, comment:'', dishes:[], orderId:'' }); }}>
          Gửi đánh giá khác
        </button>
      </div>
    );
  }

  return (
    <div className="feedback-page">
      <h1 className="page-title">Đánh giá & Phản hồi</h1>

      <div className="feedback-layout">
        {/* Form */}
        <form className="feedback-form card" onSubmit={handleSubmit}>
          <h2>✍️ Gửi đánh giá</h2>

          <div className="rating-section">
            <div className="rating-item main-rating">
              <label>Đánh giá tổng thể</label>
              <StarRating value={form.overallRating} onChange={v => setForm({...form, overallRating: v})} size="lg" />
              <p className="rating-label">{['','Tệ','Không tốt','Bình thường','Tốt','Xuất sắc'][form.overallRating]}</p>
            </div>

            <div className="rating-sub-grid">
              <div className="rating-item">
                <label>🍽️ Món ăn</label>
                <StarRating value={form.foodRating} onChange={v => setForm({...form, foodRating: v})} />
              </div>
              <div className="rating-item">
                <label>👥 Phục vụ</label>
                <StarRating value={form.serviceRating} onChange={v => setForm({...form, serviceRating: v})} />
              </div>
              <div className="rating-item">
                <label>🏮 Không gian</label>
                <StarRating value={form.ambianceRating} onChange={v => setForm({...form, ambianceRating: v})} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Món bạn đã dùng</label>
            <div className="dish-tags">
              {DISHES.map(d => (
                <button key={d} type="button"
                  className={`dish-tag ${form.dishes.includes(d) ? 'selected' : ''}`}
                  onClick={() => toggleDish(d)}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mã đơn hàng (không bắt buộc)</label>
            <input className="form-input" placeholder="#C001" value={form.orderId}
              onChange={e => setForm({...form, orderId: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Nhận xét của bạn</label>
            <textarea className="form-input" rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn tại nhà hàng..."
              value={form.comment}
              onChange={e => setForm({...form, comment: e.target.value})}
              required />
          </div>

          <button type="submit" className="submit-fb-btn" disabled={form.overallRating === 0}>
            📤 Gửi đánh giá
          </button>
          {form.overallRating === 0 && <p className="rating-warn">Vui lòng chọn số sao đánh giá tổng thể</p>}
        </form>

        {/* My feedbacks */}
        <div className="my-feedbacks">
          <h2>📋 Đánh giá của tôi</h2>
          {myFeedbacks.length === 0 ? (
            <div className="card no-fb">Bạn chưa có đánh giá nào</div>
          ) : (
            myFeedbacks.map(fb => (
              <div key={fb.id} className="fb-card card">
                <div className="fb-card-header">
                  <StarRating value={fb.overallRating} size="sm" />
                  <span className="fb-date">{fb.date}</span>
                  {fb.orderId && <span className="fb-order">{fb.orderId}</span>}
                </div>
                <p className="fb-comment">"{fb.comment}"</p>
                {fb.dishes.length > 0 && (
                  <div className="fb-dishes">
                    {fb.dishes.map((d,i) => <span key={i} className="fb-dish-tag">{d}</span>)}
                  </div>
                )}
                {fb.reply && (
                  <div className="fb-reply">
                    <span className="reply-label">💬 Phản hồi từ nhà hàng:</span>
                    <p>{fb.reply}</p>
                  </div>
                )}
                {fb.status === 'pending' && (
                  <span className="fb-pending-badge">⏳ Chờ phản hồi</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Feedback;
