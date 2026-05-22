import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', password: '', confirm: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Mật khẩu xác nhận không khớp');
    if (form.password.length < 6) return setError('Mật khẩu phải ít nhất 6 ký tự');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = register(form);
    if (result.success) navigate('/customer/menu');
    else setError(result.message);
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🍜</div>
        <h1 className="login-title">Cái Gì Cũng Không Có</h1>
        <p className="login-subtitle">Tạo tài khoản mới</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Họ tên</label>
            <input className="form-input" placeholder="Nguyễn Văn A"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <input className="form-input" placeholder="username"
              value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input className="form-input" placeholder="09xx-xxx-xxx"
              value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input className="form-input" type="password" placeholder="Ít nhất 6 ký tự"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input className="form-input" type="password" placeholder="Nhập lại mật khẩu"
              value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} required />
          </div>
          {error && <div className="login-error">⚠️ {error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Đăng ký'}
          </button>
        </form>

        <p className="login-hint">
          Đã có tài khoản? <Link to="/login" style={{color:'#e85d04', fontWeight:600}}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
