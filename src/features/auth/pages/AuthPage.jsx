import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Lock, User, Mail, Phone, Shield,
  ArrowRight, LogOut, CheckCircle, AlertCircle, ChevronRight
} from 'lucide-react';

/* === SVG ICONS === */
const ShieldCheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.7 29.3 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.4-4z" />
    <path fill="#FF3D00" d="m6.3 14.7 7.1 5.2C15.1 16.4 19.3 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 46c5.4 0 10.3-1.9 14.1-5l-6.5-5.5C29.6 37 26.9 38 24 38c-5.2 0-9.6-3.3-11.2-8l-7.1 5.5C9.8 42.6 16.3 46 24 46z" />
    <path fill="#1565C0" d="M43.6 20H24v8h11.3c-.8 2.2-2.2 4-4 5.5l6.5 5.5C41.6 36.1 44 30.5 44 24c0-1.3-.2-2.7-.4-4z" />
  </svg>
);
const VneIDIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e03e2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="2" />
    <path d="M3 20c0-2.7 2.7-5 6-5h6c3.3 0 6 2.3 6 5" />
  </svg>
);

/* === LEFT PANEL FEATURES === */
const features = [];

/* ===================================================
   LOGIN FORM
=================================================== */
function LoginForm({ onSwitch }) {
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [values, setValues] = useState({ identifier: '20210045', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Active session banner */}
      <div className="session-banner">
        <div className="session-avatar">N</div>
        <div className="session-info">
          <div className="session-name">Nguyễn Văn An</div>
          <div className="session-meta">
            <span className="session-dot" />
            Phiên đăng nhập đang mở · Hoạt động 45 phút trước
          </div>
        </div>
        <button type="button" className="session-logout">
          <LogOut size={13} />
          Đăng xuất an toàn
        </button>
      </div>

      {/* Identifier */}
      <div className="input-group">
        <label className="input-label" htmlFor="login-identifier">
          Tên đăng nhập hoặc Email
        </label>
        <div className="input-icon-wrap">
          <span className="input-icon"><User size={15} /></span>
          <input
            id="login-identifier"
            type="text"
            className="input"
            placeholder="VD: nguyenvanan / 20210045"
            value={values.identifier}
            onChange={e => setValues({ ...values, identifier: e.target.value })}
            autoComplete="username"
          />
        </div>
      </div>

      {/* Password */}
      <div className="input-group">
        <div className="flex justify-between items-center">
          <label className="input-label" htmlFor="login-password">Mật khẩu bảo mật</label>
          <a href="#" className="text-[0.8125rem] text-[var(--accent)] no-underline">
            Quên mật khẩu?
          </a>
        </div>
        <div className="input-icon-wrap relative">
          <span className="input-icon"><Lock size={15} /></span>
          <input
            id="login-password"
            type={showPass ? 'text' : 'password'}
            className="input pr-11"
            placeholder="Nhập mật khẩu"
            value={values.password}
            onChange={e => setValues({ ...values, password: e.target.value })}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text-muted)] flex items-center p-1"
            aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Remember + 2FA */}
      <div className="flex items-center justify-between">
        <label className="checkbox-wrap">
          <input
            type="checkbox"
            id="remember-me"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
          />
          Ghi nhớ đăng nhập trên thiết bị cá nhân
        </label>
        <div className="flex items-center gap-1 text-xs text-[var(--status-found)] font-semibold">
          <CheckCircle size={12} />
          2FA Kích hoạt
        </div>
      </div>

      {/* Submit */}
      <button type="submit" className="btn btn-primary btn-full btn-lg" id="login-submit-btn">
        Đăng Nhập Vào Hệ Thống
        <ArrowRight size={16} />
      </button>

      {/* Divider */}
      <div className="divider">Hoặc đăng nhập nhanh bằng danh tính</div>

      {/* Social login */}
      <div className="flex flex-col gap-3">
        <button type="button" className="btn btn-social" id="login-google-btn">
          <GoogleIcon />
          Tài khoản Google
        </button>
      </div>

      {/* Security notice */}
      <div className="security-notice">
        <Shield size={13} className="text-[var(--accent)] shrink-0" />
        <span>Bảo mật an toàn</span>
        <div className="ml-auto security-links">
          <a href="#">Điều khoản</a>
          <span>·</span>
          <a href="#">Chính sách bảo mật</a>
          <span>·</span>
          <a href="#">Hỗ trợ khẩn cấp</a>
        </div>
      </div>
    </form>
  );
}

/* ===================================================
   REGISTER FORM
=================================================== */
function RegisterForm({ onSwitch }) {
  const [showPass, setShowPass] = useState(false);
  const [values, setValues] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Full Name */}
      <div className="input-group">
        <label className="input-label" htmlFor="reg-fullname">Họ và tên đầy đủ</label>
        <div className="input-icon-wrap">
          <span className="input-icon"><User size={15} /></span>
          <input
            id="reg-fullname"
            type="text"
            className="input"
            placeholder="Nguyễn Văn An"
            value={values.fullName}
            onChange={e => setValues({ ...values, fullName: e.target.value })}
          />
        </div>
      </div>

      {/* Username + Phone side-by-side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="input-group">
          <label className="input-label" htmlFor="reg-username">Tên đăng nhập</label>
          <div className="input-icon-wrap">
            <span className="input-icon"><User size={15} /></span>
            <input
              id="reg-username"
              type="text"
              className="input"
              placeholder="nguyenvanan"
              value={values.username}
              onChange={e => setValues({ ...values, username: e.target.value })}
            />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="reg-phone">Số điện thoại</label>
          <div className="input-icon-wrap">
            <span className="input-icon"><Phone size={15} /></span>
            <input
              id="reg-phone"
              type="tel"
              className="input"
              placeholder="0912 345 678"
              value={values.phone}
              onChange={e => setValues({ ...values, phone: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="input-group">
        <label className="input-label" htmlFor="reg-email">Email liên hệ</label>
        <div className="input-icon-wrap">
          <span className="input-icon"><Mail size={15} /></span>
          <input
            id="reg-email"
            type="email"
            className="input"
            placeholder="an.nguyen@gmail.com"
            value={values.email}
            onChange={e => setValues({ ...values, email: e.target.value })}
          />
        </div>
      </div>

      {/* Password */}
      <div className="input-group">
        <label className="input-label" htmlFor="reg-password">Mật khẩu</label>
        <div className="input-icon-wrap relative">
          <span className="input-icon"><Lock size={15} /></span>
          <input
            id="reg-password"
            type={showPass ? 'text' : 'password'}
            className="input pr-11"
            placeholder="Tối thiểu 8 ký tự"
            value={values.password}
            onChange={e => setValues({ ...values, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[var(--text-muted)] flex items-center"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div className="input-group">
        <label className="input-label" htmlFor="reg-confirm">Xác nhận mật khẩu</label>
        <div className="input-icon-wrap">
          <span className="input-icon"><Lock size={15} /></span>
          <input
            id="reg-confirm"
            type="password"
            className="input"
            placeholder="Nhập lại mật khẩu"
            value={values.confirm}
            onChange={e => setValues({ ...values, confirm: e.target.value })}
          />
        </div>
      </div>

      {/* Terms */}
      <label className="checkbox-wrap text-[0.8125rem]">
        <input type="checkbox" id="reg-terms" required />
        <span>
          Tôi đồng ý với{' '}
          <a href="#" className="text-[var(--accent)] no-underline">điều khoản sử dụng</a>
          {' '}và{' '}
          <a href="#" className="text-[var(--accent)] no-underline">chính sách bảo mật</a>
          {' '}của TimDo
        </span>
      </label>

      {/* Submit */}
      <button type="submit" className="btn btn-primary btn-full btn-lg" id="register-submit-btn">
        Tạo Tài Khoản Mới
        <ArrowRight size={16} />
      </button>

      {/* Divider */}
      <div className="divider">Hoặc đăng nhập nhanh bằng danh tính</div>

      {/* Social */}
      <div className="flex flex-col gap-3">
        <button type="button" className="btn btn-social" id="register-google-btn">
          <GoogleIcon />
          Tài khoản Google
        </button>
      </div>

      {/* Security */}
      <div className="security-notice">
        <Shield size={13} className="text-[var(--accent)] shrink-0" />
        <span>Bảo mật an toàn</span>
        <div className="ml-auto security-links">
          <a href="#">Chính sách bảo mật</a>
        </div>
      </div>
    </form>
  );
}

/* ===================================================
   MAIN AUTH PAGE
=================================================== */
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="auth-page">
      {/* ── LEFT PANEL ── */}
      <div className="auth-panel-left">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 relative z-10">
          <div className="w-[38px] h-[38px] bg-white/15 border border-white/20 rounded-[10px] flex items-center justify-center">
            <ShieldCheckIcon />
          </div>
          <div>
            <div className="font-[var(--font-display)] font-extrabold text-[1.125rem] text-white leading-[1.1]">TimDo</div>
            <div className="text-[0.6875rem] text-white/55 font-medium">CapStone v2.4</div>
          </div>
          <div className="ml-2 text-[0.6875rem] font-semibold bg-[#5ec4c433] text-[#5ec4c4] border border-[#5ec4c44d] px-2 py-0.5 rounded">
            Cổng Dịch Vụ Tìm & Bàn Giao Thất Lạc
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 mb-auto">
          <div className="text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#5ec4c4e6] mb-4">
            Nền tảng vì cộng đồng
          </div>
          <div className="animated-text-container">
            <h1 className="animated-text-item font-[var(--font-display)] font-extrabold text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.2] tracking-[-0.02em] text-white m-0">
              Bảo vệ thông tin,<br />kết nối lòng tốt.
            </h1>
            <h1 className="animated-text-item font-[var(--font-display)] font-extrabold text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.2] tracking-[-0.02em] text-white m-0">
              Tìm lại đồ thất lạc<br />nhẹ nhàng & an tâm.
            </h1>
            <h1 className="animated-text-item font-[var(--font-display)] font-extrabold text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.2] tracking-[-0.02em] text-white m-0">
              Cộng đồng văn minh,<br />chia sẻ trách nhiệm.
            </h1>
          </div>
        </div>

        {/* Testimonial */}

      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-panel-right">
        <div className="auth-form-container animate-scaleIn">
          {/* Header */}
          <div className="mb-7">
            <div className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)] mb-2">
            </div>
            <div className="flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-[1.75rem] font-extrabold text-[var(--text-primary)] tracking-[-0.02em]">
                {activeTab === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
              </h2>
              {/* Tab switcher */}
              <div className="auth-tabs mb-0">
                <button
                  type="button"
                  className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                  id="tab-login"
                  onClick={() => setActiveTab('login')}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                  id="tab-register"
                  onClick={() => setActiveTab('register')}
                >
                  Đăng ký mới
                </button>
              </div>
            </div>
          </div>

          {/* Form content */}
          {activeTab === 'login' ? (
            <LoginForm onSwitch={() => setActiveTab('register')} />
          ) : (
            <RegisterForm onSwitch={() => setActiveTab('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
