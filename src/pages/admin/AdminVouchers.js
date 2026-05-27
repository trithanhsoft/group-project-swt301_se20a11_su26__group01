import React, { useState } from 'react';
import './AdminVouchers.css';

const initialVouchers = [
  { id: 1, code: 'WELCOME', discount: 50000, type: 'fixed',   minOrder: 200000, used: 12, total: 100, active: true,  expiry: '2026-12-31' },
  { id: 2, code: 'CGKC5',   discount: 5,     type: 'percent', minOrder: 500000, used: 34, total: 999, active: true,  expiry: '2026-12-31' },
  { id: 3, code: 'CGKC10',  discount: 10,    type: 'percent', minOrder: 1500000,used: 18, total: 999, active: true,  expiry: '2026-12-31' },
  { id: 4, code: 'SUMMER20',discount: 20,    type: 'percent', minOrder: 300000, used: 5,  total: 50,  active: false, expiry: '2026-06-30' },
];

function AdminVouchers() {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ code:'', discount:'', type:'percent', minOrder:'', total:'', expiry:'' });

  const toggleActive = (id) => setVouchers(prev => prev.map(v => v.id === id ? {...v, active: !v.active} : v));
  const deleteVoucher = (id) => setVouchers(prev => prev.filter(v => v.id !== id));

  const handleAdd = (e) => {
    e.preventDefault();
    setVouchers(prev => [...prev, { ...form, id: Date.now(), used: 0, active: true, discount: Number(form.discount), minOrder: Number(form.minOrder), total: Number(form.total) }]);
    setShowAdd(false);
    setForm({ code:'', discount:'', type:'percent', minOrder:'', total:'', expiry:'' });
  };

  return (
    <div className="admin-vouchers">
      <div className="page-header">
        <h1 className="page-title">Quản lý mã giảm giá</h1>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Tạo voucher</button>
      </div>

      <div className="vouchers-grid">
        {vouchers.map(v => (
          <div key={v.id} className={`voucher-admin-card card ${!v.active ? 'inactive' : ''}`}>
            <div className="vac-header">
              <span className="vac-code">{v.code}</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={v.active} onChange={() => toggleActive(v.id)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="vac-discount">
              {v.type === 'percent' ? `-${v.discount}%` : `-${v.discount.toLocaleString('vi-VN')}đ`}
            </div>
            <div className="vac-details">
              <span>Đơn tối thiểu: {v.minOrder.toLocaleString('vi-VN')}đ</span>
              <span>Đã dùng: {v.used}/{v.total}</span>
              <span>HSD: {v.expiry}</span>
            </div>
            <div className="vac-progress">
              <div className="vac-bar" style={{width: `${(v.used/v.total)*100}%`}}></div>
            </div>
            <button className="vac-del" onClick={() => deleteVoucher(v.id)}>🗑️ Xóa</button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="add-modal card" onClick={e => e.stopPropagation()}>
            <h2>Tạo voucher mới</h2>
            <form onSubmit={handleAdd}>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Mã voucher</label>
                  <input className="form-input" placeholder="VD: SUMMER30" value={form.code}
                    onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Loại giảm</label>
                  <select className="form-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (đ)</option>
                  </select>
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Giá trị giảm</label>
                  <input className="form-input" type="number" placeholder={form.type === 'percent' ? '10' : '50000'}
                    value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Đơn tối thiểu (đ)</label>
                  <input className="form-input" type="number" placeholder="200000"
                    value={form.minOrder} onChange={e => setForm({...form, minOrder: e.target.value})} required />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Số lượng</label>
                  <input className="form-input" type="number" placeholder="100"
                    value={form.total} onChange={e => setForm({...form, total: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Hạn sử dụng</label>
                  <input className="form-input" type="date" value={form.expiry}
                    onChange={e => setForm({...form, expiry: e.target.value})} required />
                </div>
              </div>
              <div className="modal-btns">
                <button type="submit" className="btn-primary">Tạo voucher</button>
                <button type="button" className="btn-cancel" onClick={() => setShowAdd(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVouchers;
