import React, { useEffect, useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import './Profile.css';

const AVATARS = ['👤', '👨', '👩', '🧑', '👨‍🍳', '👩‍🍳', '🧔', '👱'];

function Profile() {
  const {
    profile,
    updateProfile,
    getCurrentTier,
    getNextTier,
    getAvailableVouchers,
    VOUCHER_TIERS
  } = useProfile();

  const { user, changePassword } = useAuth();

  const [backendUser, setBackendUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);

  const [pwForm, setPwForm] = useState({
    old: '',
    new: '',
    confirm: ''
  });

  const [pwMsg, setPwMsg] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);

  const tier = getCurrentTier();
  const nextTier = getNextTier();
  const vouchers = getAvailableVouchers();

  const progressToNext = nextTier
    ? Math.min((profile.totalSpend / nextTier.minSpend) * 100, 100)
    : 100;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) {
        return;
      }

      setProfileLoading(true);
      setProfileError('');

      try {
        const response = await API.get('/users/profile', {
          params: {
            email: user.email
          }
        });

        setBackendUser(response.data);

        setForm((prev) => ({
          ...prev,
          name: response.data.username || prev.name,
          email: response.data.email || prev.email
        }));
      } catch (error) {
        console.error('Fetch profile error:', error);
        setProfileError('Không thể tải thông tin tài khoản');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return profile.joinDate;
    }

    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
      return profile.joinDate;
    }
  };

  const displayName = backendUser?.username || profile.name || user?.username || 'User';
  const displayEmail = backendUser?.email || profile.email || user?.email || '';
  const displayRole = backendUser?.roleName || user?.roleName || 'CUSTOMER';
  const displayJoinDate = formatDate(backendUser?.createdAt);
  const displayStatus = backendUser?.isActive ? 'Đang hoạt động' : 'Đã khóa';

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const openPasswordModal = () => {
    setPwForm({
      old: '',
      new: '',
      confirm: ''
    });
    setPwMsg(null);
    setShowChangePw(true);
  };

  const closePasswordModal = () => {
    if (pwLoading) {
      return;
    }

    setShowChangePw(false);
    setPwMsg(null);
    setPwForm({
      old: '',
      new: '',
      confirm: ''
    });
  };

  const handleChangePw = async (e) => {
    e.preventDefault();

    setPwMsg(null);

    if (!pwForm.old || !pwForm.new || !pwForm.confirm) {
      setPwMsg({
        ok: false,
        text: 'Vui lòng nhập đầy đủ thông tin.'
      });
      return;
    }

    if (pwForm.new !== pwForm.confirm) {
      setPwMsg({
        ok: false,
        text: 'Mật khẩu xác nhận không khớp.'
      });
      return;
    }

    if (pwForm.new.length < 6) {
      setPwMsg({
        ok: false,
        text: 'Mật khẩu mới phải ít nhất 6 ký tự.'
      });
      return;
    }

    if (pwForm.old === pwForm.new) {
      setPwMsg({
        ok: false,
        text: 'Mật khẩu mới không được trùng mật khẩu hiện tại.'
      });
      return;
    }

    try {
      setPwLoading(true);

      const result = await changePassword(pwForm.old, pwForm.new);

      if (result.success) {
        setPwMsg({
          ok: true,
          text: 'Đổi mật khẩu thành công.'
        });

        setPwForm({
          old: '',
          new: '',
          confirm: ''
        });

        setTimeout(() => {
          setShowChangePw(false);
          setPwMsg(null);
        }, 1200);
      } else {
        setPwMsg({
          ok: false,
          text: result.message || 'Đổi mật khẩu thất bại.'
        });
      }
    } catch (error) {
      setPwMsg({
        ok: false,
        text: 'Không thể đổi mật khẩu. Vui lòng thử lại.'
      });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">Hồ sơ của tôi</h1>

      {profileLoading && (
        <p className="profile-detail">Đang tải thông tin tài khoản...</p>
      )}

      {profileError && (
        <p className="pw-error">{profileError}</p>
      )}

      <div className="profile-layout">
        <div className="profile-left">
          <div className="profile-card card">
            <div className="profile-avatar-wrap">
              <div
                className="profile-avatar"
                onClick={() => editing && setShowAvatars(!showAvatars)}
              >
                {form.avatar || '👤'}
              </div>

              {editing && <p className="avatar-hint">Nhấn để đổi</p>}

              {showAvatars && editing && (
                <div className="avatar-picker">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      className={`avatar-opt ${
                        form.avatar === avatar ? 'selected' : ''
                      }`}
                      onClick={() => {
                        setForm({
                          ...form,
                          avatar
                        });
                        setShowAvatars(false);
                      }}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {editing ? (
              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Họ tên</label>

                  <input
                    className="form-input"
                    value={form.name || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>

                  <input
                    className="form-input"
                    placeholder="09xx-xxx-xxx"
                    value={form.phone || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>

                  <input
                    className="form-input"
                    type="email"
                    placeholder="email@example.com"
                    value={form.email || ''}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ngày sinh</label>

                  <input
                    className="form-input"
                    type="date"
                    value={form.birthday || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        birthday: e.target.value
                      })
                    }
                  />
                </div>

                <div className="profile-btns">
                  <button className="save-btn" onClick={handleSave}>
                    💾 Lưu
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setEditing(false);
                      setForm({ ...profile });
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <h2 className="profile-name">{displayName}</h2>

                <p className="profile-detail">✉️ {displayEmail}</p>

                {profile.phone && (
                  <p className="profile-detail">📞 {profile.phone}</p>
                )}

                {profile.birthday && (
                  <p className="profile-detail">🎂 {profile.birthday}</p>
                )}

                <p className="profile-detail">
                  🔐 Vai trò: {displayRole}
                </p>

                <p className="profile-detail">
                  ✅ Trạng thái: {displayStatus}
                </p>

                <p className="profile-detail">
                  📅 Thành viên từ {displayJoinDate}
                </p>

                {saved && (
                  <p className="save-success">✅ Đã lưu thành công!</p>
                )}

                <button
                  className="edit-btn"
                  onClick={() => setEditing(true)}
                >
                  ✏️ Chỉnh sửa
                </button>

                <button
                  className="edit-btn"
                  style={{ marginTop: 8 }}
                  onClick={openPasswordModal}
                >
                  🔑 Đổi mật khẩu
                </button>
              </div>
            )}
          </div>

          <div className="spend-stats card">
            <h3>📊 Thống kê chi tiêu</h3>

            <div className="stat-row">
              <span>Tổng chi tiêu</span>
              <strong className="stat-val">
                {profile.totalSpend.toLocaleString('vi-VN')}đ
              </strong>
            </div>

            <div className="stat-row">
              <span>Số đơn hàng</span>
              <strong className="stat-val">
                {profile.orderCount} đơn
              </strong>
            </div>

            <div className="stat-row">
              <span>Trung bình / đơn</span>
              <strong className="stat-val">
                {profile.orderCount > 0
                  ? Math.round(profile.totalSpend / profile.orderCount).toLocaleString('vi-VN')
                  : 0}
                đ
              </strong>
            </div>
          </div>
        </div>

        <div className="profile-right">
          <div className="tier-card card">
            <h3>🏆 Hạng thành viên</h3>

            {tier ? (
              <div
                className="tier-current"
                style={{ '--tier-color': tier.color }}
              >
                <div className="tier-badge">⭐ {tier.label}</div>
                <p className="tier-desc">
                  Bạn đang ở hạng <strong>{tier.label}</strong>
                </p>
              </div>
            ) : (
              <p className="tier-none">Chưa đạt hạng thành viên</p>
            )}

            {nextTier && (
              <div className="tier-progress">
                <div className="progress-label">
                  <span>
                    Tiến độ đến <strong>{nextTier.label}</strong>
                  </span>
                  <span>
                    {profile.totalSpend.toLocaleString('vi-VN')}đ /{' '}
                    {nextTier.minSpend.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressToNext}%` }}
                  ></div>
                </div>

                <p className="progress-hint">
                  Còn{' '}
                  <strong>
                    {(nextTier.minSpend - profile.totalSpend).toLocaleString('vi-VN')}đ
                  </strong>{' '}
                  nữa để lên hạng
                </p>
              </div>
            )}

            <div className="tier-list">
              {VOUCHER_TIERS.map((voucherTier) => (
                <div
                  key={voucherTier.code}
                  className={`tier-item ${
                    profile.totalSpend >= voucherTier.minSpend
                      ? 'unlocked'
                      : 'locked'
                  }`}
                >
                  <span
                    className="tier-dot"
                    style={{ background: voucherTier.color }}
                  ></span>

                  <span className="tier-name">{voucherTier.label}</span>

                  <span className="tier-req">
                    ≥ {voucherTier.minSpend.toLocaleString('vi-VN')}đ
                  </span>

                  <span className="tier-reward">
                    -
                    {voucherTier.code === 'CGKC5'
                      ? '5%'
                      : voucherTier.code === 'CGKC10'
                      ? '10%'
                      : voucherTier.code === 'CGKC15'
                      ? '15%'
                      : '20%'}
                  </span>

                  {profile.totalSpend >= voucherTier.minSpend ? (
                    <span className="tier-check">✓</span>
                  ) : (
                    <span className="tier-lock">🔒</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="vouchers-card card">
            <h3>🎁 Voucher của tôi</h3>

            {vouchers.length === 0 ? (
              <p className="no-voucher">
                Chưa có voucher. Chi tiêu thêm để nhận voucher!
              </p>
            ) : (
              <div className="voucher-list">
                {vouchers.map((voucher) => (
                  <div key={voucher.code} className="voucher-item">
                    <div className="voucher-left">
                      <div className="voucher-discount">
                        {voucher.type === 'percent'
                          ? `-${voucher.discount}%`
                          : `-${voucher.discount.toLocaleString('vi-VN')}đ`}
                      </div>

                      <div>
                        <p className="voucher-label">{voucher.label}</p>
                        <p className="voucher-tier">{voucher.tier}</p>
                      </div>
                    </div>

                    <div className="voucher-code-wrap">
                      <span className="voucher-code">{voucher.code}</span>

                      <button
                        className="copy-btn"
                        onClick={() =>
                          navigator.clipboard?.writeText(voucher.code)
                        }
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="voucher-hint">
              💡 Dùng mã voucher khi thanh toán trong giỏ hàng
            </p>
          </div>
        </div>
      </div>

      {showChangePw && (
        <div className="profile-modal-overlay" onClick={closePasswordModal}>
          <div className="password-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="password-modal-header">
              <div>
                <h2>Đổi mật khẩu</h2>
                <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn.</p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closePasswordModal}
                disabled={pwLoading}
              >
                ✕
              </button>
            </div>

            <form className="pw-form modal-pw-form" onSubmit={handleChangePw}>
              <div className="form-group">
                <label className="form-label">Mật khẩu hiện tại</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại"
                  value={pwForm.old}
                  onChange={(e) =>
                    setPwForm({
                      ...pwForm,
                      old: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu mới</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Ít nhất 6 ký tự"
                  value={pwForm.new}
                  onChange={(e) =>
                    setPwForm({
                      ...pwForm,
                      new: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu mới</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={pwForm.confirm}
                  onChange={(e) =>
                    setPwForm({
                      ...pwForm,
                      confirm: e.target.value
                    })
                  }
                  required
                />
              </div>

              {pwMsg && (
                <p className={pwMsg.ok ? 'save-success' : 'pw-error'}>
                  {pwMsg.ok ? '✅ ' : '❌ '}
                  {pwMsg.text}
                </p>
              )}

              <div className="modal-btns">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closePasswordModal}
                  disabled={pwLoading}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={pwLoading}
                >
                  {pwLoading ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;