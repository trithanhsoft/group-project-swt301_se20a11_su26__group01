import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminAccounts.css';

const ROLES = ['admin', 'staff', 'kitchen', 'customer'];
const roleLabel  = { admin: 'Admin', staff: 'Nhân viên', kitchen: 'Bếp', customer: 'Khách hàng' };
const roleColor  = { admin: '#fed7c3', staff: '#e6f4ff', kitchen: '#fefcbf', customer: '#c6f6d5' };
const roleIcon   = { admin: '👑', staff: '🧑‍💼', kitchen: '👨‍🍳', customer: '👤' };

function AdminAccounts() {
  const { getAllAccounts, updateAccount, deleteAccount, banAccount, resetPassword, changeRole, user: currentUser } = useAuth();
  const accounts = getAllAccounts();

  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | banned
  const [editing, setEditing]       = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [showAdd, setShowAdd]       = useState(false);
  const [addForm, setAddForm]       = useState({ name:'', username:'', password:'', role:'customer', phone:'' });
  const [toast, setToast]           = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type, username, label }

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = accounts.filter(a => {
    const matchSearch = a.name?.toLowerCase().includes(search.toLowerCase()) ||
                        a.username.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'all' || a.role === roleFilter;
    const matchStatus = statusFilter === 'all' ||
                        (statusFilter === 'banned' && a.banned) ||
                        (statusFilter === 'active' && !a.banned);
    return matchSearch && matchRole && matchStatus;
  });

  // Stats
  const stats = {
    total:   accounts.length,
    active:  accounts.filter(a => !a.banned).length,
    banned:  accounts.filter(a => a.banned).length,
    byRole:  ROLES.reduce((acc, r) => ({ ...acc, [r]: accounts.filter(a => a.role === r).length }), {}),
  };

  const handleEdit = (acc) => {
    setEditing(acc.username);
    setEditForm({ name: acc.name, phone: acc.phone || '' });
  };

  const handleSave = () => {
    updateAccount(editing, editForm);
    setEditing(null);
    showToast('Đã cập nhật thông tin');
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (accounts.find(a => a.username === addForm.username)) {
      showToast('Tên đăng nhập đã tồn tại', false);
      return;
    }
    updateAccount(addForm.username, { ...addForm, banned: false });
    setShowAdd(false);
    setAddForm({ name:'', username:'', password:'', role:'customer', phone:'' });
    showToast('Đã thêm tài khoản mới');
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { type, username } = confirmAction;
    if (type === 'delete') { deleteAccount(username); showToast('Đã xóa tài khoản'); }
    if (type === 'ban')    { banAccount(username);    showToast(accounts.find(a=>a.username===username)?.banned ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản'); }
    if (type === 'reset')  { resetPassword(username); showToast(`Mật khẩu đã reset về 123456`); }
    setConfirmAction(null);
  };

  const isSelf = (username) => username === currentUser?.username;

  return (
    <div className="admin-accounts">
      {/* Toast */}
      {toast && <div className={`ac-toast ${toast.ok ? 'toast-ok' : 'toast-err'}`}>{toast.msg}</div>}

      <div className="page-header">
        <h1 className="page-title">Quản lý người dùng</h1>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Thêm tài khoản</button>
      </div>

      {/* Stats */}
      <div className="ac-stats">
        <div className="ac-stat-card" onClick={() => setStatusFilter('all')}>
          <span className="ac-stat-num">{stats.total}</span>
          <span className="ac-stat-label">Tổng tài khoản</span>
        </div>
        <div className="ac-stat-card active-card" onClick={() => setStatusFilter('active')}>
          <span className="ac-stat-num">{stats.active}</span>
          <span className="ac-stat-label">Đang hoạt động</span>
        </div>
        <div className="ac-stat-card banned-card" onClick={() => setStatusFilter('banned')}>
          <span className="ac-stat-num">{stats.banned}</span>
          <span className="ac-stat-label">Đã khóa</span>
        </div>
        {ROLES.map(r => (
          <div key={r} className="ac-stat-card role-card" onClick={() => setRoleFilter(r)}>
            <span className="ac-stat-num">{stats.byRole[r]}</span>
            <span className="ac-stat-label">{roleIcon[r]} {roleLabel[r]}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="accounts-toolbar">
        <input className="search-input" placeholder="🔍 Tìm theo tên hoặc username..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-row">
          <div className="filter-tabs">
            {['all', ...ROLES].map(r => (
              <button key={r} className={`filter-tab ${roleFilter === r ? 'active' : ''}`}
                onClick={() => setRoleFilter(r)}>
                {r === 'all' ? 'Tất cả role' : `${roleIcon[r]} ${roleLabel[r]}`}
              </button>
            ))}
          </div>
          <div className="filter-tabs">
            {[['all','Tất cả'],['active','Hoạt động'],['banned','Đã khóa']].map(([v,l]) => (
              <button key={v} className={`filter-tab ${statusFilter === v ? 'active' : ''}`}
                onClick={() => setStatusFilter(v)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="accounts-table card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Username</th>
              <th>Vai trò</th>
              <th>SĐT</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{textAlign:'center', color:'#a0aec0', padding:24}}>Không có tài khoản nào</td></tr>
            )}
            {filtered.map(acc => (
              <tr key={acc.username} className={acc.banned ? 'row-banned' : ''}>
                {/* Tên */}
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm">{acc.name?.charAt(0) || '?'}</div>
                    <div>
                      {editing === acc.username
                        ? <input className="inline-input" value={editForm.name}
                            onChange={e => setEditForm({...editForm, name: e.target.value})} />
                        : <strong>{acc.name}</strong>}
                      {isSelf(acc.username) && <span className="self-badge">Bạn</span>}
                    </div>
                  </div>
                </td>

                {/* Username */}
                <td><code className="username-code">{acc.username}</code></td>

                {/* Role — dropdown trực tiếp */}
                <td>
                  <select
                    className="role-select"
                    value={acc.role}
                    style={{ background: roleColor[acc.role] }}
                    disabled={isSelf(acc.username)}
                    onChange={e => { changeRole(acc.username, e.target.value); showToast(`Đã đổi role thành ${roleLabel[e.target.value]}`); }}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{roleIcon[r]} {roleLabel[r]}</option>)}
                  </select>
                </td>

                {/* SĐT */}
                <td>
                  {editing === acc.username
                    ? <input className="inline-input" value={editForm.phone}
                        onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                    : <span className="phone-text">{acc.phone || '—'}</span>}
                </td>

                {/* Trạng thái */}
                <td>
                  <span className={`status-pill ${acc.banned ? 'pill-banned' : 'pill-active'}`}>
                    {acc.banned ? '🔒 Đã khóa' : '✅ Hoạt động'}
                  </span>
                </td>

                {/* Thao tác */}
                <td>
                  <div className="action-btns">
                    {editing === acc.username ? (
                      <>
                        <button className="ac-btn save-btn" onClick={handleSave} title="Lưu">💾</button>
                        <button className="ac-btn cancel-btn" onClick={() => setEditing(null)} title="Hủy">✕</button>
                      </>
                    ) : (
                      <>
                        <button className="ac-btn edit-btn" onClick={() => handleEdit(acc)} title="Chỉnh sửa">✏️</button>
                        <button
                          className={`ac-btn ${acc.banned ? 'unban-btn' : 'ban-btn'}`}
                          disabled={isSelf(acc.username)}
                          title={acc.banned ? 'Mở khóa' : 'Khóa tài khoản'}
                          onClick={() => setConfirmAction({ type:'ban', username: acc.username, label: acc.banned ? `Mở khóa "${acc.name}"?` : `Khóa tài khoản "${acc.name}"?` })}
                        >
                          {acc.banned ? '🔓' : '🔒'}
                        </button>
                        <button
                          className="ac-btn reset-btn"
                          title="Reset mật khẩu về 123456"
                          onClick={() => setConfirmAction({ type:'reset', username: acc.username, label: `Reset mật khẩu "${acc.name}" về 123456?` })}
                        >
                          🔑
                        </button>
                        <button
                          className="ac-btn del-btn"
                          disabled={isSelf(acc.username)}
                          title="Xóa tài khoản"
                          onClick={() => setConfirmAction({ type:'delete', username: acc.username, label: `Xóa vĩnh viễn tài khoản "${acc.name}"?` })}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm dialog */}
      {confirmAction && (
        <div className="modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="confirm-modal card" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">
              {confirmAction.type === 'delete' ? '🗑️' : confirmAction.type === 'ban' ? '🔒' : '🔑'}
            </div>
            <p className="confirm-text">{confirmAction.label}</p>
            {confirmAction.type === 'reset' && (
              <p className="confirm-sub">Mật khẩu mới sẽ là: <strong>123456</strong></p>
            )}
            {confirmAction.type === 'delete' && (
              <p className="confirm-sub" style={{color:'#e53e3e'}}>Hành động này không thể hoàn tác!</p>
            )}
            <div className="confirm-btns">
              <button className={`confirm-ok ${confirmAction.type === 'delete' ? 'danger' : ''}`} onClick={handleConfirm}>
                Xác nhận
              </button>
              <button className="confirm-cancel" onClick={() => setConfirmAction(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="add-modal card" onClick={e => e.stopPropagation()}>
            <h2>➕ Thêm tài khoản mới</h2>
            <form onSubmit={handleAdd}>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Họ tên</label>
                  <input className="form-input" value={addForm.name}
                    onChange={e => setAddForm({...addForm, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input className="form-input" value={addForm.username}
                    onChange={e => setAddForm({...addForm, username: e.target.value})} required />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Mật khẩu</label>
                  <input className="form-input" type="password" value={addForm.password}
                    onChange={e => setAddForm({...addForm, password: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">SĐT</label>
                  <input className="form-input" value={addForm.phone}
                    onChange={e => setAddForm({...addForm, phone: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Vai trò</label>
                <select className="form-input" value={addForm.role}
                  onChange={e => setAddForm({...addForm, role: e.target.value})}>
                  {ROLES.map(r => <option key={r} value={r}>{roleIcon[r]} {roleLabel[r]}</option>)}
                </select>
              </div>
              <div className="modal-btns">
                <button type="submit" className="btn-primary">Thêm tài khoản</button>
                <button type="button" className="btn-cancel" onClick={() => setShowAdd(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAccounts;
