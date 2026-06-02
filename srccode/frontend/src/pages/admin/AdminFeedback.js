import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import './AdminFeedback.css';

const STARS = [5, 4, 3, 2, 1];

function StarDisplay({ value }) {
  return (
    <span className="star-display">
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ color: n <= value ? '#f6ad55' : '#e2e8f0' }}>★</span>
      ))}
    </span>
  );
}

function AdminFeedback() {
  const { feedbacks, replyFeedback } = useFeedback();
  const [filter, setFilter]       = useState('all'); // all | pending | replied
  const [starFilter, setStarFilter] = useState(0);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText]   = useState('');
  const [hidden, setHidden]         = useState([]);
  const [search, setSearch]         = useState('');

  const filtered = feedbacks.filter(f => {
    if (hidden.includes(f.id)) return false;
    if (filter === 'pending' && f.status !== 'pending') return false;
    if (filter === 'replied' && f.status !== 'replied') return false;
    if (starFilter > 0 && f.overallRating !== starFilter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) &&
        !f.comment.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total:   feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    replied: feedbacks.filter(f => f.status === 'replied').length,
    avg:     feedbacks.length
      ? (feedbacks.reduce((s, f) => s + f.overallRating, 0) / feedbacks.length).toFixed(1)
      : 0,
  };

  const handleReply = (id) => {
    if (!replyText.trim()) return;
    replyFeedback(id, replyText.trim());
    setReplyingId(null);
    setReplyText('');
  };

  return (
    <div className="admin-feedback">
      <div className="page-header">
        <h1 className="page-title">Quản lý phản hồi</h1>
      </div>

      {/* Stats */}
      <div className="fb-stats">
        <div className="fb-stat-card">
          <span className="fb-stat-num">{stats.total}</span>
          <span className="fb-stat-label">Tổng đánh giá</span>
        </div>
        <div className="fb-stat-card" style={{borderTopColor:'#d69e2e'}}>
          <span className="fb-stat-num" style={{color:'#d69e2e'}}>⭐ {stats.avg}</span>
          <span className="fb-stat-label">Điểm trung bình</span>
        </div>
        <div className="fb-stat-card" style={{borderTopColor:'#e85d04'}}>
          <span className="fb-stat-num" style={{color:'#e85d04'}}>{stats.pending}</span>
          <span className="fb-stat-label">Chờ phản hồi</span>
        </div>
        <div className="fb-stat-card" style={{borderTopColor:'#38a169'}}>
          <span className="fb-stat-num" style={{color:'#38a169'}}>{stats.replied}</span>
          <span className="fb-stat-label">Đã phản hồi</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="fb-toolbar">
        <input className="search-input" placeholder="🔍 Tìm theo tên hoặc nội dung..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-row">
          <div className="filter-tabs">
            {[['all','Tất cả'],['pending','Chờ phản hồi'],['replied','Đã phản hồi']].map(([v,l]) => (
              <button key={v} className={`filter-tab ${filter === v ? 'active' : ''}`}
                onClick={() => setFilter(v)}>{l}</button>
            ))}
          </div>
          <div className="filter-tabs">
            <button className={`filter-tab ${starFilter === 0 ? 'active' : ''}`}
              onClick={() => setStarFilter(0)}>Tất cả sao</button>
            {STARS.map(s => (
              <button key={s} className={`filter-tab ${starFilter === s ? 'active' : ''}`}
                onClick={() => setStarFilter(s)}>{'★'.repeat(s)}</button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="fb-list">
        {filtered.length === 0 && (
          <div className="card" style={{textAlign:'center', padding:40, color:'#a0aec0'}}>
            Không có đánh giá nào
          </div>
        )}
        {filtered.map(fb => (
          <div key={fb.id} className={`fb-card card ${fb.status === 'pending' ? 'fb-pending' : ''}`}>
            <div className="fb-card-header">
              <div className="fb-user">
                <div className="fb-avatar">{fb.name.charAt(0)}</div>
                <div>
                  <strong>{fb.name}</strong>
                  <span className="fb-date">{fb.date}</span>
                  {fb.orderId && <span className="fb-order-tag">{fb.orderId}</span>}
                </div>
              </div>
              <div className="fb-right">
                <StarDisplay value={fb.overallRating} />
                <span className={`fb-status-badge ${fb.status === 'pending' ? 'badge-pending' : 'badge-replied'}`}>
                  {fb.status === 'pending' ? '⏳ Chờ phản hồi' : '✅ Đã phản hồi'}
                </span>
                <button className="hide-btn" onClick={() => setHidden(prev => [...prev, fb.id])}
                  title="Ẩn đánh giá này">🙈</button>
              </div>
            </div>

            {/* Sub ratings */}
            <div className="fb-sub-ratings">
              <span>🍽️ Món ăn: <StarDisplay value={fb.foodRating} /></span>
              <span>👥 Phục vụ: <StarDisplay value={fb.serviceRating} /></span>
              <span>🏮 Không gian: <StarDisplay value={fb.ambianceRating} /></span>
            </div>

            <p className="fb-comment">"{fb.comment}"</p>

            {fb.dishes?.length > 0 && (
              <div className="fb-dishes">
                {fb.dishes.map((d, i) => <span key={i} className="fb-dish-tag">{d}</span>)}
              </div>
            )}

            {/* Reply section */}
            {fb.reply && (
              <div className="fb-reply-box">
                <span className="reply-from">💬 Phản hồi từ nhà hàng:</span>
                <p>{fb.reply}</p>
              </div>
            )}

            {replyingId === fb.id ? (
              <div className="reply-form">
                <textarea
                  className="reply-input"
                  rows={3}
                  placeholder="Nhập phản hồi..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  autoFocus
                />
                <div className="reply-btns">
                  <button className="reply-send-btn" onClick={() => handleReply(fb.id)}
                    disabled={!replyText.trim()}>
                    📤 Gửi phản hồi
                  </button>
                  <button className="reply-cancel-btn" onClick={() => { setReplyingId(null); setReplyText(''); }}>
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <button className="reply-btn" onClick={() => { setReplyingId(fb.id); setReplyText(fb.reply || ''); }}>
                {fb.reply ? '✏️ Sửa phản hồi' : '💬 Phản hồi'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminFeedback;
