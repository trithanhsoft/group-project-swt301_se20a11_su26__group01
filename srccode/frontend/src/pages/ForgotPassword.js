import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function ForgotPassword() {
  const { getAllAccounts, updateAccount } = useAuth();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleFind = (e) => {
    e.preventDefault();
    setError('');
    const accounts = getAllAccounts();
    const found = accounts.find(a => a.username === username.trim());
    if (!found) return setError('Không tìm thấy tài khoản với tên đăng nhập này');
    setStep(2);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setError('');
    if (newPass.length < 6) return setError('Mật khẩu phải ít nhất 6 ký tự');
    if (newPass !== confirm) return setError('Mật khẩu xác nhận không khớp');
    // Cập nhật password thực sự vào AuthContext
    updateAccount(username, { password: newPass });
    setStep(3);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🔑</div>
        <h1 className="login-title">Quên mật khẩu</h1>

        {step === 1 && (
          <form onSubmit={handleFind} className="login-form">
            <p className="login-subtitle">Nhập tên đăng nhập để đặt lại mật khẩu</p>
            <div className="form-group">
              <label className="form-label">Tên đăng nhập</label>
              <input className="form-input" placeholder="username"
                value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
            </div>
            {error && <div className="login-error">⚠️ {error}</div>}
            <button type="submit" className="login-btn">Tiếp theo →</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset} className="login-form">
            <p className="login-subtitle">Đặt mật khẩu mới cho <strong>{username}</strong></p>
            <div className="form-group">
              <label className="form-label">Mật khẩu mới</label>
              <input className="form-input" type="password" placeholder="Ít nhất 6 ký tự"
                value={newPass} onChange={e => setNewPass(e.target.value)} required autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu mới</label>
              <input className="form-input" type="password" placeholder="Nhập lại"
                value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            {error && <div className="login-error">⚠️ {error}</div>}
            <button type="submit" className="login-btn">Đặt lại mật khẩu</button>
          </form>
        )}

        {step === 3 && (
          <div style={{textAlign:'center', padding:'16px 0'}}>
            <div style={{fontSize:48, marginBottom:12}}>✅</div>
            <p style={{marginBottom:8, fontWeight:700, fontSize:16}}>Đặt lại mật khẩu thành công!</p>
            <p style={{marginBottom:24, color:'#718096', fontSize:13}}>
              Tài khoản <strong>{username}</strong> đã được cập nhật mật khẩu mới.
            </p>
            <Link to="/login" className="login-btn" style={{display:'block', textAlign:'center'}}>
              Đăng nhập ngay
            </Link>
          </div>
        )}

        {step < 3 && (
          <p className="login-hint">
            <Link to="/login" style={{color:'#e85d04', fontWeight:600}}>← Quay lại đăng nhập</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
