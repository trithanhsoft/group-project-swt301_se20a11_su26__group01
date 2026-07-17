import React, { useEffect, useState } from 'react';
import {
  getAllFeedbacks,
  updateFeedbackStatus,
  deleteFeedback
} from '../../services/feedbackService';
import './AdminFeedback.css';

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await getAllFeedbacks();
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy feedback:', error);
      alert('Không thể tải feedback từ backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (feedbackId, status) => {
    try {
      await updateFeedbackStatus(feedbackId, status);
      await fetchFeedbacks();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Không thể cập nhật trạng thái.');
    }
  };

  const handleDelete = async (feedbackId) => {
    const ok = window.confirm('Bạn có chắc muốn xóa phản hồi này không?');

    if (!ok) {
      return;
    }

    try {
      await deleteFeedback(feedbackId);
      setFeedbacks(prev => prev.filter(item => item.feedbackId !== feedbackId));
    } catch (error) {
      console.error('Lỗi khi xóa feedback:', error);
      alert('Không thể xóa feedback.');
    }
  };

  const statusMap = {
    NEW: 'Mới',
    REVIEWED: 'Đã xem',
    RESOLVED: 'Đã xử lý'
  };

  const getCustomerDisplayName = (item) => {
    return item.customerName || item.username || 'Khách hàng';
  };

  const getCustomerContact = (item) => {
    if (item.customerEmail) {
      return item.customerEmail;
    }

    if (item.customerPhone) {
      return item.customerPhone;
    }

    return '-';
  };

  const filteredFeedbacks = feedbacks.filter(item => {
    const keyword = search.trim().toLowerCase();

    const matchStatus =
      filter === 'ALL' ||
      item.status === filter;

    const matchSearch =
      !keyword ||
      item.customerName?.toLowerCase().includes(keyword) ||
      item.customerEmail?.toLowerCase().includes(keyword) ||
      item.customerPhone?.toLowerCase().includes(keyword) ||
      item.username?.toLowerCase().includes(keyword) ||
      item.tableName?.toLowerCase().includes(keyword) ||
      item.orderCode?.toLowerCase().includes(keyword) ||
      item.content?.toLowerCase().includes(keyword);

    return matchStatus && matchSearch;
  });

  const total = feedbacks.length;
  const newCount = feedbacks.filter(item => item.status === 'NEW').length;
  const reviewedCount = feedbacks.filter(item => item.status === 'REVIEWED').length;
  const resolvedCount = feedbacks.filter(item => item.status === 'RESOLVED').length;
  const avgRating =
    total > 0
      ? (feedbacks.reduce((sum, item) => sum + Number(item.rating || 0), 0) / total).toFixed(1)
      : '0.0';

  return (
    <div className="admin-feedback-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý phản hồi</h1>
          <p className="page-subtitle">
            Theo dõi phản hồi từ khách hàng đăng nhập và khách quét QR tại bàn.
          </p>
        </div>

        <button className="btn-primary" onClick={fetchFeedbacks}>
          🔄 Làm mới
        </button>
      </div>

      <div className="feedback-stats">
        <div className="stat-card card">
          <h3>{total}</h3>
          <p>Tổng phản hồi</p>
        </div>

        <div className="stat-card card">
          <h3>{newCount}</h3>
          <p>Mới</p>
        </div>

        <div className="stat-card card">
          <h3>{reviewedCount}</h3>
          <p>Đã xem</p>
        </div>

        <div className="stat-card card">
          <h3>{resolvedCount}</h3>
          <p>Đã xử lý</p>
        </div>

        <div className="stat-card card">
          <h3>{avgRating}</h3>
          <p>Đánh giá TB</p>
        </div>
      </div>

      <div className="feedback-toolbar">
        <input
          className="search-input"
          placeholder="🔍 Tìm theo tên, email, SĐT, bàn, mã đơn hoặc nội dung..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            Tất cả
          </button>

          <button
            className={`filter-tab ${filter === 'NEW' ? 'active' : ''}`}
            onClick={() => setFilter('NEW')}
          >
            Mới
          </button>

          <button
            className={`filter-tab ${filter === 'REVIEWED' ? 'active' : ''}`}
            onClick={() => setFilter('REVIEWED')}
          >
            Đã xem
          </button>

          <button
            className={`filter-tab ${filter === 'RESOLVED' ? 'active' : ''}`}
            onClick={() => setFilter('RESOLVED')}
          >
            Đã xử lý
          </button>
        </div>
      </div>

      <div className="feedback-table-card card">
        {loading ? (
          <p>Đang tải phản hồi...</p>
        ) : (
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Đánh giá</th>
                <th>Nội dung</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map(item => (
                  <tr key={item.feedbackId}>
                    <td>
                      <strong>{getCustomerDisplayName(item)}</strong>

                      <br />

                      <small>
                        {getCustomerContact(item)}
                      </small>

                      {item.customerPhone && item.customerEmail && (
                        <>
                          <br />
                          <small>📞 {item.customerPhone}</small>
                        </>
                      )}

                      {(item.tableName || item.orderCode) && (
                        <>
                          <br />
                          <small>
                            {item.tableName ? `🪑 ${item.tableName}` : ''}
                            {item.orderCode ? ` · 🧾 ${item.orderCode}` : ''}
                          </small>
                        </>
                      )}

                      {!item.userId && (
                        <>
                          <br />
                          <small className="qr-feedback-tag">
                            QR Guest
                          </small>
                        </>
                      )}
                    </td>

                    <td>
                      <span className="feedback-rating">
                        {'⭐'.repeat(item.rating || 0)}
                      </span>
                    </td>

                    <td className="feedback-content-cell">
                      {item.content}
                    </td>

                    <td>
                      <select
                        className={`status-select status-${item.status?.toLowerCase()}`}
                        value={item.status}
                        onChange={e => handleChangeStatus(item.feedbackId, e.target.value)}
                      >
                        <option value="NEW">{statusMap.NEW}</option>
                        <option value="REVIEWED">{statusMap.REVIEWED}</option>
                        <option value="RESOLVED">{statusMap.RESOLVED}</option>
                      </select>
                    </td>

                    <td>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString('vi-VN')
                        : '-'}
                    </td>

                    <td>
                      <button
                        className="action-btn del-btn"
                        onClick={() => handleDelete(item.feedbackId)}
                        title="Xóa phản hồi"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Không có phản hồi nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminFeedback;