import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: otp + new pass, 3: success

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Step 1 — gửi OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email: email.trim() });
      setMessage(res.data || 'Mã OTP đã được gửi tới email của bạn');
      setStep(2);
    } catch (err) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'Không thể gửi OTP';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — reset mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.trim().length !== 6) { setError('Mã OTP phải gồm 6 số'); return; }
    if (newPass.length < 6) { setError('Mật khẩu phải ít nhất 6 ký tự'); return; }
    if (newPass !== confirm) { setError('Mật khẩu xác nhận không khớp'); return; }
    setLoading(true);
    try {
      await API.post('/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPass,
      });
      setStep(3);
    } catch (err) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'Đặt lại mật khẩu thất bại';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#1a1a2e] to-gray-900 px-4 relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-[#e85d04]/30 rounded-tl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-[#e85d04]/30 rounded-br-3xl"></div>

      <div className="w-full max-w-sm">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-8">

          {/* Step 1 — nhập email */}
          {step === 1 && (
            <>
              <div className="text-center mb-7">
                <div className="text-5xl mb-3">🔑</div>
                <h1 className="text-xl font-extrabold text-gray-800">Quên mật khẩu</h1>
                <p className="text-gray-500 text-sm mt-1">Nhập email để nhận mã OTP</p>
              </div>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#e85d04]" />
                </div>
                {error && <p className="text-red-500 text-xs">⚠️ {error}</p>}
                {message && <p className="text-green-600 text-xs">✅ {message}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-[#e85d04] hover:bg-[#c44d00] text-white font-bold py-3 rounded-xl text-sm disabled:opacity-60 transition-colors">
                  {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                </button>
                <p className="text-center text-sm">
                  <Link to="/login" className="text-gray-400 hover:text-[#e85d04]">← Quay lại đăng nhập</Link>
                </p>
              </form>
            </>
          )}

          {/* Step 2 — nhập OTP + mật khẩu mới */}
          {step === 2 && (
            <>
              <div className="text-center mb-7">
                <div className="text-5xl mb-3">📩</div>
                <h1 className="text-xl font-extrabold text-gray-800">Nhập mã OTP</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Đã gửi tới <strong>{email}</strong>
                </p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã OTP (6 số)</label>
                  <input type="text" inputMode="numeric" maxLength={6}
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="______" required autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-center tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-[#e85d04]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu mới</label>
                  <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                    placeholder="Ít nhất 6 ký tự" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#e85d04]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#e85d04]" />
                </div>
                {error && <p className="text-red-500 text-xs">⚠️ {error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-[#e85d04] hover:bg-[#c44d00] text-white font-bold py-3 rounded-xl text-sm disabled:opacity-60 transition-colors">
                  {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </button>
                <button type="button" onClick={() => { setStep(1); setOtp(''); setNewPass(''); setConfirm(''); setError(''); }}
                  className="w-full text-sm text-gray-400 hover:text-[#e85d04] text-center">
                  ← Đổi email khác
                </button>
              </form>
            </>
          )}

          {/* Step 3 — thành công */}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-lg font-extrabold text-gray-800 mb-2">Đặt lại mật khẩu thành công!</h2>
              <p className="text-gray-500 text-sm mb-6">Bạn có thể đăng nhập bằng mật khẩu mới.</p>
              <Link to="/login"
                className="inline-block w-full bg-[#e85d04] hover:bg-[#c44d00] text-white font-bold py-3 rounded-xl text-sm text-center transition-colors">
                Đăng nhập ngay
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
