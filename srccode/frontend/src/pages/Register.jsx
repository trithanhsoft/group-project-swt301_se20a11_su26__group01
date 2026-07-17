import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [socialMsg, setSocialMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSocial = () => {
    setSocialMsg(true);
    setTimeout(() => setSocialMsg(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Mật khẩu xác nhận không khớp'); return; }
    if (form.password.length < 6) { setError('Mật khẩu phải ít nhất 6 ký tự'); return; }
    setLoading(true);
    const result = await register({
      username: form.fullName,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {socialMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg">
          🚧 Tính năng đang phát triển
        </div>
      )}
      {/* Left — ảnh */}
      <div className="hidden lg:block w-[45%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-10">
          <h2 className="text-white text-3xl font-extrabold mb-2">F Restaurant</h2>
          <p className="text-white/80 text-sm">Trải nghiệm ẩm thực đẳng cấp tại TP.Đà Nẵng</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng Ký Tài Khoản Mới</h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Họ và tên"
              value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#e85d04] focus:bg-white" />

            <input type="email" placeholder="Email"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#e85d04] focus:bg-white" />

            <div className="relative">
              <input type={showPass ? 'text' : 'password'} placeholder="Mật khẩu"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#e85d04] focus:bg-white" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} placeholder="Xác nhận mật khẩu"
                value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} required
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#e85d04] focus:bg-white" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>

            {error && <p className="text-red-500 text-xs">⚠️ {error}</p>}

            <p className="text-xs text-gray-500">
              Bạn đã có tài khoản?{' '}
              <Link to="/login" className="text-[#e85d04] font-semibold hover:underline">Đăng nhập</Link>
            </p>

            <button type="submit" disabled={loading}
              className="w-full bg-[#e85d04] hover:bg-[#c44d00] text-white font-bold py-3 rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
              {loading ? <span className="spinner"></span> : 'Đăng ký'}
            </button>

            <div className="relative flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 shrink-0">Hoặc đăng ký bằng</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={handleSocial} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button type="button" onClick={handleSocial} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
