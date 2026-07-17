import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  createFeedback,
  getFeedbacksByCustomer
} from '../../services/feedbackService';
import './Feedback.css';

function Feedback() {
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyFeedbacks();
  }, []);

  const fetchMyFeedbacks = async () => {
    if (!user?.userId) {
      return;
    }

    try {
      const data = await getFeedbacksByCustomer(user.userId);
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy phản hồi:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('Vui lòng nhập nội dung phản hồi.');
      return;
    }

    try {
      setLoading(true);

      await createFeedback({
        userId: user?.userId || null,
        customerName: user?.username || '',
        customerEmail: user?.email || '',
        rating: Number(rating),
        content: content.trim()
      });

      alert('Gửi phản hồi thành công.');

      setRating(5);
      setContent('');

      await fetchMyFeedbacks();
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi:', error);
      alert('Không thể gửi phản hồi. Vui lòng kiểm tra backend.');
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    NEW: 'Mới',
    REVIEWED: 'Đã xem',
    RESOLVED: 'Đã xử lý'
  };

  return (
    <div className="feedback-page">
      <div className="page-header">
        <h1 className="page-title">Phản hồi</h1>
        <p className="page-subtitle">
          Gửi đánh giá của bạn để nhà hàng cải thiện chất lượng dịch vụ.
        </p>
      </div>

      <div className="feedback-layout">
        <div className="feedback-form-card card">
          <h2>Gửi phản hồi</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Đánh giá</label>

              <select
                className="form-input"
                value={rating}
                onChange={e => setRating(e.target.value)}
              >
                <option value="5">⭐⭐⭐⭐⭐ - Rất tốt</option>
                <option value="4">⭐⭐⭐⭐ - Tốt</option>
                <option value="3">⭐⭐⭐ - Bình thường</option>
                <option value="2">⭐⭐ - Chưa tốt</option>
                <option value="1">⭐ - Tệ</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nội dung</label>

              <textarea
                className="form-input"
                rows={5}
                placeholder="Nhập phản hồi của bạn..."
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
            </button>
          </form>
        </div>

        <div className="feedback-list-card card">
          <h2>Phản hồi của tôi</h2>

          {feedbacks.length === 0 ? (
            <p>Bạn chưa gửi phản hồi nào.</p>
          ) : (
            <div className="feedback-list">
              {feedbacks.map(item => (
                <div key={item.feedbackId} className="feedback-item">
                  <div className="feedback-item-top">
                    <span className="feedback-rating">
                      {'⭐'.repeat(item.rating)}
                    </span>

                    <span className={`feedback-status status-${item.status?.toLowerCase()}`}>
                      {statusMap[item.status] || item.status}
                    </span>
                  </div>

                  <p className="feedback-content">{item.content}</p>

                  <small>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString('vi-VN')
                      : ''}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feedback;