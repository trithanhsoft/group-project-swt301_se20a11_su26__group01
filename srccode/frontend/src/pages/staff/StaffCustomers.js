import React, { useEffect, useMemo, useState } from 'react';
import { getStaffCustomers } from '../../services/userService';
import './StaffCustomers.css';

function StaffCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const data = await getStaffCustomers();
      setCustomers(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách hàng:', error);
      alert('Không thể tải danh sách khách hàng từ backend.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString('vi-VN') + 'đ';
  };

  const formatDate = (value) => {
    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (value) => {
    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleString('vi-VN');
  };

  const statusLabel = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PREPARING: 'Đang chế biến',
    READY: 'Sẵn sàng',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy'
  };

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let result = customers.filter(customer => {
      const isActive = customer.isActive ?? customer.active ?? true;
      const totalOrders = Number(customer.totalOrders || 0);

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && isActive) ||
        (statusFilter === 'INACTIVE' && !isActive);

      const matchOrder =
        orderFilter === 'ALL' ||
        (orderFilter === 'HAS_ORDER' && totalOrders > 0) ||
        (orderFilter === 'NO_ORDER' && totalOrders === 0);

      const matchSearch =
        !keyword ||
        customer.username?.toLowerCase().includes(keyword) ||
        customer.email?.toLowerCase().includes(keyword) ||
        customer.lastCustomerPhone?.toLowerCase().includes(keyword) ||
        String(customer.userId || '').includes(keyword);

      return matchStatus && matchOrder && matchSearch;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortBy === 'spent') {
        return Number(b.totalSpent || 0) - Number(a.totalSpent || 0);
      }

      if (sortBy === 'orders') {
        return Number(b.totalOrders || 0) - Number(a.totalOrders || 0);
      }

      if (sortBy === 'lastOrder') {
        return new Date(b.lastOrderAt || 0) - new Date(a.lastOrderAt || 0);
      }

      return 0;
    });

    return result;
  }, [customers, search, statusFilter, orderFilter, sortBy]);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.isActive ?? c.active ?? true).length;
  const inactiveCustomers = totalCustomers - activeCustomers;
  const customersWithOrders = customers.filter(c => Number(c.totalOrders || 0) > 0).length;
  const totalRevenue = customers.reduce(
    (sum, c) => sum + Number(c.totalSpent || 0),
    0
  );
  const totalOrders = customers.reduce(
    (sum, c) => sum + Number(c.totalOrders || 0),
    0
  );

  return (
    <div className="staff-customers-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Khách hàng</h1>

          <p className="page-subtitle">
            Theo dõi khách hàng đã đăng ký tài khoản. Khách quét QR không đăng nhập vẫn được lưu trong đơn hàng.
          </p>
        </div>

        <button className="btn-primary" onClick={fetchCustomers}>
          🔄 Làm mới
        </button>
      </div>

      <div className="customer-note card">
        <strong>Ghi chú nghiệp vụ:</strong>{' '}
        Danh sách này chỉ bao gồm tài khoản có vai trò CUSTOMER. Khách vãng lai đặt món bằng QR sẽ được ghi nhận qua tên và số điện thoại trong đơn hàng, nhưng không tự động tạo tài khoản khách hàng.
      </div>

      <div className="customer-stats">
        <div className="stat-card card">
          <div className="stat-icon">👥</div>
          <div>
            <h3>{totalCustomers}</h3>
            <p>Khách có tài khoản</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">✅</div>
          <div>
            <h3>{activeCustomers}</h3>
            <p>Đang hoạt động</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">🔒</div>
          <div>
            <h3>{inactiveCustomers}</h3>
            <p>Đã khóa</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">🧾</div>
          <div>
            <h3>{customersWithOrders}</h3>
            <p>Có đơn hàng</p>
          </div>
        </div>

        <div className="stat-card card revenue-card">
          <div className="stat-icon">💰</div>
          <div>
            <h3>{formatCurrency(totalRevenue)}</h3>
            <p>Chi tiêu từ tài khoản</p>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon">📦</div>
          <div>
            <h3>{totalOrders}</h3>
            <p>Đơn từ tài khoản</p>
          </div>
        </div>
      </div>

      <div className="customer-toolbar card">
        <input
          className="search-input"
          placeholder="🔍 Tìm theo tên, email, SĐT gần nhất hoặc ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="toolbar-row">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              Tất cả trạng thái
            </button>

            <button
              className={`filter-tab ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ACTIVE')}
            >
              Hoạt động
            </button>

            <button
              className={`filter-tab ${statusFilter === 'INACTIVE' ? 'active' : ''}`}
              onClick={() => setStatusFilter('INACTIVE')}
            >
              Đã khóa
            </button>
          </div>

          <div className="filter-tabs">
            <button
              className={`filter-tab ${orderFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setOrderFilter('ALL')}
            >
              Tất cả đơn
            </button>

            <button
              className={`filter-tab ${orderFilter === 'HAS_ORDER' ? 'active' : ''}`}
              onClick={() => setOrderFilter('HAS_ORDER')}
            >
              Đã từng đặt
            </button>

            <button
              className={`filter-tab ${orderFilter === 'NO_ORDER' ? 'active' : ''}`}
              onClick={() => setOrderFilter('NO_ORDER')}
            >
              Chưa có đơn
            </button>
          </div>
        </div>

        <div className="sort-row">
          <label>Sắp xếp:</label>

          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Khách mới nhất</option>
            <option value="oldest">Khách cũ nhất</option>
            <option value="spent">Chi tiêu cao nhất</option>
            <option value="orders">Nhiều đơn nhất</option>
            <option value="lastOrder">Đơn gần nhất</option>
          </select>

          <span className="result-count">
            Hiển thị {filteredCustomers.length}/{totalCustomers} khách hàng có tài khoản
          </span>
        </div>
      </div>

      <div className="customers-table-card card">
        {loading ? (
          <div className="loading-box">Đang tải khách hàng...</div>
        ) : (
          <table className="customers-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Liên hệ</th>
                <th>Đơn hàng</th>
                <th>Chi tiêu</th>
                <th>Đơn gần nhất</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => {
                  const isActive = customer.isActive ?? customer.active ?? true;

                  return (
                    <tr key={customer.userId}>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {(customer.username || customer.email || 'C').charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{customer.username || 'Khách hàng'}</strong>
                            <br />
                            <small>ID #{customer.userId}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="contact-cell">
                          <span>{customer.email || '-'}</span>
                          <small>
                            SĐT gần nhất: {customer.lastCustomerPhone || 'Chưa có'}
                          </small>
                        </div>
                      </td>

                      <td>
                        <div className="order-metrics">
                          <span>
                            Tổng: <strong>{customer.totalOrders || 0}</strong>
                          </span>

                          <small>
                            Hoàn thành: {customer.completedOrders || 0} · Hủy: {customer.cancelledOrders || 0}
                          </small>
                        </div>
                      </td>

                      <td>
                        <strong className="money-text">
                          {formatCurrency(customer.totalSpent)}
                        </strong>
                      </td>

                      <td>
                        {customer.lastOrderCode ? (
                          <div className="last-order-cell">
                            <strong>{customer.lastOrderCode}</strong>

                            <small>
                              {statusLabel[customer.lastOrderStatus] || customer.lastOrderStatus}
                            </small>

                            <small>{formatDate(customer.lastOrderAt)}</small>
                          </div>
                        ) : (
                          <span className="empty-text">Chưa có đơn</span>
                        )}
                      </td>

                      <td>
                        <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                          {isActive ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>

                      <td>
                        <button
                          className="view-btn"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-row">
                    Không tìm thấy khách hàng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="customer-modal card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết khách hàng</h2>

              <button
                className="close-btn"
                onClick={() => setSelectedCustomer(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-customer-main">
              <div className="customer-avatar large">
                {(selectedCustomer.username || selectedCustomer.email || 'C').charAt(0).toUpperCase()}
              </div>

              <div>
                <h3>{selectedCustomer.username || 'Khách hàng'}</h3>
                <p>{selectedCustomer.email}</p>

                <span className={`status-badge ${(selectedCustomer.isActive ?? true) ? 'active' : 'inactive'}`}>
                  {(selectedCustomer.isActive ?? true) ? 'Hoạt động' : 'Đã khóa'}
                </span>
              </div>
            </div>

            <div className="customer-note modal-note">
              Đây là khách hàng có tài khoản. Các đơn vãng lai từ QR không đăng nhập được quản lý ở mục đơn hàng.
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span>ID khách hàng</span>
                <strong>#{selectedCustomer.userId}</strong>
              </div>

              <div className="detail-item">
                <span>Ngày tạo tài khoản</span>
                <strong>{formatDateTime(selectedCustomer.createdAt)}</strong>
              </div>

              <div className="detail-item">
                <span>Số điện thoại gần nhất từ đơn hàng</span>
                <strong>{selectedCustomer.lastCustomerPhone || '-'}</strong>
              </div>

              <div className="detail-item">
                <span>Tổng số đơn từ tài khoản</span>
                <strong>{selectedCustomer.totalOrders || 0}</strong>
              </div>

              <div className="detail-item">
                <span>Đơn đang xử lý</span>
                <strong>{selectedCustomer.activeOrders || 0}</strong>
              </div>

              <div className="detail-item">
                <span>Đơn hoàn thành</span>
                <strong>{selectedCustomer.completedOrders || 0}</strong>
              </div>

              <div className="detail-item">
                <span>Đơn đã hủy</span>
                <strong>{selectedCustomer.cancelledOrders || 0}</strong>
              </div>

              <div className="detail-item">
                <span>Tổng chi tiêu từ tài khoản</span>
                <strong>{formatCurrency(selectedCustomer.totalSpent)}</strong>
              </div>

              <div className="detail-item">
                <span>Mã đơn gần nhất</span>
                <strong>{selectedCustomer.lastOrderCode || '-'}</strong>
              </div>

              <div className="detail-item">
                <span>Trạng thái đơn gần nhất</span>
                <strong>
                  {statusLabel[selectedCustomer.lastOrderStatus] || selectedCustomer.lastOrderStatus || '-'}
                </strong>
              </div>

              <div className="detail-item">
                <span>Thời gian đơn gần nhất</span>
                <strong>{formatDateTime(selectedCustomer.lastOrderAt)}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setSelectedCustomer(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffCustomers;