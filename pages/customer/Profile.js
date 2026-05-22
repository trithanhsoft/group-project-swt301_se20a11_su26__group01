import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const AVATARS = ['👤','👨','👩','🧑','👨‍🍳','👩‍🍳','🧔','👱'];

function Profile() {
  const { profile, updateProfile, getCurrentTier, getNextTier, getAvailableVouchers, VOUCHER_TIERS } = useProfile();
  const { changePassword } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [pwForm, setPwForm] = useState({ old: '', new: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState(null);

  const tier = getCurrentTier();
  const nextTier = getNextTier();
  const vouchers = getAvailableVouchers();

  const progressToNext = nextTier
    ? Math.min((profile.totalSpend / nextTier.minSpend) * 100, 100)
    : 100;

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePw = (e) => {
    e.preventDefault();
    if (pwForm.new !== pwForm.confirm) return setPwMsg({ ok: false, text: 'Mật khẩu xác nhận không khớp' });
    if (pwForm.new.length < 6) return setPwMsg({ ok: false, text: 'Mật khẩu phải ít nhất 6 ký tự' });
    const result = changePassword(pwForm.old, pwForm.new);
    setPwMsg({ ok: result.success, text: result.success ? '✅ Đổi mật khẩu thành công!' : `❌ ${result.message}` });
    if (result.success) { setPwForm({ old:'', new:'', confirm:'' }); setTimeout(() => setShowChangePw(false), 1500); }
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">Hồ sơ của tôi</h1>

      <div className="profile-layout">
        {/* Left: Profile card */}
        <div className="profile-left">
          <div className="profile-card card">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar" onClick={() => editing && setShowAvatars(!showAvatars)}>
                {form.avatar}
              </div>
              {editing && <p className="avatar-hint">Nhấn để đổi</p>}
              {showAvatars && editing && (
                <div className="avatar-picker">
                  {AVATARS.map(a => (
                    <button key={a} className={`avatar-opt ${form.avatar === a ? 'selected' : ''}`}
                      onClick={() => { setForm({ ...form, avatar: a }); setShowAvatars(false); }}>
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {editing ? (
              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">Họ tên</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input className="form-input" placeholder="09xx-xxx-xxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày sinh</label>
                  <input className="form-input" type="date" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} />
                </div>
                <div className="profile-btns">
                  <button className="save-btn" onClick={handleSave}>💾 Lưu</button>
                  <button className="cancel-btn" onClick={() => { setEditing(false); setForm({ ...profile }); }}>Hủy</button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <h2 className="profile-name">{profile.name}</h2>
                {profile.phone && <p className="profile-detail">📞 {profile.phone}</p>}
                {profile.email && <p className="profile-detail">✉️ {profile.email}</p>}
                {profile.birthday && <p className="profile-detail">🎂 {profile.birthday}</p>}
                <p className="profile-detail">📅 Thành viên từ {profile.joinDate}</p>
                {saved && <p className="save-success">✅ Đã lưu thành công!</p>}
                <button className="edit-btn" onClick={() => setEditing(true)}>✏️ Chỉnh sửa</button>
                <button className="edit-btn" style={{marginTop:8}} onClick={() => setShowChangePw(!showChangePw)}>
                  🔑 Đổi mật khẩu
                </button>
                {showChangePw && (
                  <form className="pw-form" onSubmit={handleChangePw}>
                    <input className="form-input" type="password" placeholder="Mật khẩu hiện tại"
                      value={pwForm.old} onChange={e => setPwForm({...pwForm, old: e.target.value})} required />
                    <input className="form-input" type="password" placeholder="Mật khẩu mới"
                      value={pwForm.new} onChange={e => setPwForm({...pwForm, new: e.target.value})} required />
                    <input className="form-input" type="password" placeholder="Xác nhận mật khẩu mới"
                      value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} required />
                    {pwMsg && <p className={pwMsg.ok ? 'save-success' : 'pw-error'}>{pwMsg.text}</p>}
                    <button type="submit" className="save-btn">Xác nhận</button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="spend-stats card">
            <h3>📊 Thống kê chi tiêu</h3>
            <div className="stat-row">
              <span>Tổng chi tiêu</span>
              <strong className="stat-val">{profile.totalSpend.toLocaleString('vi-VN')}đ</strong>
            </div>
            <div className="stat-row">
              <span>Số đơn hàng</span>
              <strong className="stat-val">{profile.orderCount} đơn</strong>
            </div>
            <div className="stat-row">
              <span>Trung bình / đơn</span>
              <strong className="stat-val">
                {profile.orderCount > 0 ? Math.round(profile.totalSpend / profile.orderCount).toLocaleString('vi-VN') : 0}đ
              </strong>
            </div>
          </div>
        </div>

        {/* Right: Tier + Vouchers */}
        <div className="profile-right">
          {/* Membership tier */}
          <div className="tier-card card">
            <h3>🏆 Hạng thành viên</h3>
            {tier ? (
              <div className="tier-current" style={{ '--tier-color': tier.color }}>
                <div className="tier-badge">⭐ {tier.label}</div>
                <p className="tier-desc">Bạn đang ở hạng <strong>{tier.label}</strong></p>
              </div>
            ) : (
              <p className="tier-none">Chưa đạt hạng thành viên</p>
            )}

            {nextTier && (
              <div className="tier-progress">
                <div className="progress-label">
                  <span>Tiến độ đến <strong>{nextTier.label}</strong></span>
                  <span>{profile.totalSpend.toLocaleString('vi-VN')}đ / {nextTier.minSpend.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressToNext}%` }}></div>
                </div>
                <p className="progress-hint">
                  Còn <strong>{(nextTier.minSpend - profile.totalSpend).toLocaleString('vi-VN')}đ</strong> nữa để lên hạng
                </p>
              </div>
            )}

            <div className="tier-list">
              {VOUCHER_TIERS.map(t => (
                <div key={t.code} className={`tier-item ${profile.totalSpend >= t.minSpend ? 'unlocked' : 'locked'}`}>
                  <span className="tier-dot" style={{ background: t.color }}></span>
                  <span className="tier-name">{t.label}</span>
                  <span className="tier-req">≥ {t.minSpend.toLocaleString('vi-VN')}đ</span>
                  <span className="tier-reward">-{
                    t.code === 'CGKC5' ? '5%' : t.code === 'CGKC10' ? '10%' : t.code === 'CGKC15' ? '15%' : '20%'
                  }</span>
                  {profile.totalSpend >= t.minSpend ? <span className="tier-check">✓</span> : <span className="tier-lock">🔒</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Vouchers */}
          <div className="vouchers-card card">
            <h3>🎁 Voucher của tôi</h3>
            {vouchers.length === 0 ? (
              <p className="no-voucher">Chưa có voucher. Chi tiêu thêm để nhận voucher!</p>
            ) : (
              <div className="voucher-list">
                {vouchers.map(v => (
                  <div key={v.code} className="voucher-item">
                    <div className="voucher-left">
                      <div className="voucher-discount">
                        {v.type === 'percent' ? `-${v.discount}%` : `-${v.discount.toLocaleString('vi-VN')}đ`}
                      </div>
                      <div>
                        <p className="voucher-label">{v.label}</p>
                        <p className="voucher-tier">{v.tier}</p>
                      </div>
                    </div>
                    <div className="voucher-code-wrap">
                      <span className="voucher-code">{v.code}</span>
                      <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(v.code)}>
                        📋 Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="voucher-hint">💡 Dùng mã voucher khi thanh toán trong giỏ hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
