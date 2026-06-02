import React, { useState } from 'react';
import './StaffCustomers.css';

const initialCustomers = [
  { id: 1, name: 'Nguyễn Văn An',  phone: '0901-234-567', email: 'an@email.com',  visits: 8,  totalSpend: 4200000, lastVisit: '22/05/2026', note: 'Khách VIP, thích bàn cạnh cửa sổ' },
  { id: 2, name: 'Trần Thị Bích',  phone: '0912-345-678', email: 'bich@email.com', visits: 5,  totalSpend: 2800000, lastVisit: '20/05/2026', note: 'Dị ứng hải sản' },
  { id: 3, name: 'Lê Minh Khoa',   phone: '0933-456-789', email: '',               visits: 12, totalSpend: 7500000, lastVisit: '22/05/2026', note: '' },
  { id: 4, name: 'Phạm Thu Hà',    phone: '0944-567-890', email: 'ha@email.com',   visits: 3,  totalSpend: 1200000, lastVisit: '18/05/2026', note: 'Sinh nhật 15/06' },
  { id: 5, name: 'Hoàng Văn Nam',  phone: '0955-678-901', email: '',               visits: 1,  totalSpend: 450000,  lastVisit: '10/05/2026', note: '' },
];

function StaffCustomers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch]       = useState('');
  const [editing, setEditing]     = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [showAdd, setShowAdd]     = useState(false);
  const [addForm, setAddForm]     = useState({ name:'', phone:'', email:'', note:'' });

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleEdit = (c) => {
    setEditing(c.id);
    setEditForm({ name: c.name, phone: c.phone, email: c.email, note: c.note });
  };

  const handleSave = (id) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...editForm } : c));
    setEditing(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setCustomers(prev => [...prev, {
      ...addForm, id: Date.now(),
      visits: 0, totalSpend: 0,
      lastVisit: new Date().toLocaleDateString('vi-VN'),
    }]);
    setShowAdd(false);
    setAddForm({ name:'', phone:'', email:'', note:'' });
  };

  const getTier = (spend) => {
    if (spend >= 6000000) return { label: 'Kim Cương', color: '#3182ce' };
    if (spend >= 3000000) return { label: 'Bạch Kim',  color: '#805ad5' };
    if (spend >= 1500000) return { label: 'Vàng',      color: '#d69e2e' };
    if (spend >= 500000)  return { label: 'Bạc',       color: '#a0aec0' };
    return { label: 'Mới', color: '#718096' };
  };

  return (
    <div className="staff-customers">
      <div className="page-header">
        <h1 className="page-title">Khách hàng</h1>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Thêm khách</button>
      </div>

      <input className="search-input" placeholder="🔍 Tìm theo tên hoặc SĐT..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{marginBottom:16}} />

      <div className="customers-list">
        {filtered.map(c => {
          const tier = getTier(c.totalSpend);
          return (
            <div key={c.id} className="customer-card card">
              {editing === c.id ? (
                <div className="edit-form">
                  <div className="edit-row">
                    <div className="form-group">
                      <label className="form-label">Họ tên</label>
                      <input className="form-input" value={editForm.name}
                        onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SĐT</label>
                      <input className="form-input" value={editForm.phone}
                        onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" value={editForm.email}
                        onChange={e => setEditForm({...editForm, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ghi chú</label>
                    <input className="form-input" value={editForm.note}
                      onChange={e => setEditForm({...editForm, note: e.target.value})} />
                  </div>
                  <div className="edit-btns">
                    <button className="save-btn-sm" onClick={() => handleSave(c.id)}>💾 Lưu</button>
                    <button className="cancel-btn-sm" onClick={() => setEditing(null)}>Hủy</button>
                  </div>
                </div>
              ) : (
                <div className="customer-info">
                  <div className="cust-avatar-lg">{c.name.charAt(0)}</div>
                  <div className="cust-details">
                    <div className="cust-name-row">
                      <h3>{c.name}</h3>
                      <span className="tier-badge" style={{background: tier.color}}>⭐ {tier.label}</span>
                    </div>
                    <div className="cust-meta">
                      <span>📞 {c.phone}</span>
                      {c.email && <span>✉️ {c.email}</span>}
                      <span>🗓 Lần cuối: {c.lastVisit}</span>
                    </div>
                    <div className="cust-stats">
                      <span className="cust-stat">🔁 {c.visits} lần ghé</span>
                      <span className="cust-stat">💰 {c.totalSpend.toLocaleString('vi-VN')}đ</span>
                    </div>
                    {c.note && <p className="cust-note">📝 {c.note}</p>}
                  </div>
                  <button className="edit-cust-btn" onClick={() => handleEdit(c)}>✏️</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="add-cust-modal card" onClick={e => e.stopPropagation()}>
            <h2>➕ Thêm khách hàng</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Họ tên</label>
                <input className="form-input" value={addForm.name}
                  onChange={e => setAddForm({...addForm, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">SĐT</label>
                <input className="form-input" value={addForm.phone}
                  onChange={e => setAddForm({...addForm, phone: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={addForm.email}
                  onChange={e => setAddForm({...addForm, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Ghi chú</label>
                <input className="form-input" placeholder="Dị ứng, sở thích..."
                  value={addForm.note} onChange={e => setAddForm({...addForm, note: e.target.value})} />
              </div>
              <div className="modal-btns">
                <button type="submit" className="btn-primary">Thêm</button>
                <button type="button" className="btn-cancel" onClick={() => setShowAdd(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffCustomers;
