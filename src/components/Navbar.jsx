import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, LogOut, User, Settings, FileText, ChevronDown } from 'lucide-react';

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

/* ── AVATAR DROPDOWN ── */
function AvatarDropdown({ onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    navigate('/dang-nhap');
  };

  const menuItems = [
    { icon: User, label: 'Hồ sơ cá nhân', to: '/ho-so' },
    { icon: FileText, label: 'Bài đăng của tôi', to: '/bai-dang-cua-toi' },
    { icon: Settings, label: 'Cài đặt tài khoản', to: '/cai-dat' },
  ];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        id="nav-avatar-btn"
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: '1.5px solid var(--border-strong)',
          borderRadius: '999px', padding: '3px 10px 3px 3px',
          cursor: 'pointer', transition: 'all 200ms',
          color: 'var(--text-primary)',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
        aria-label="Tài khoản"
        aria-expanded={open}
      >
        <img
          src="https://api.dicebear.com/7.x/initials/svg?seed=NV&backgroundColor=1e6b6b&textColor=ffffff"
          alt="Nguyễn Văn An"
          style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }}
        />
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1 }}>NV</span>
        <ChevronDown
          size={13}
          style={{
            transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--text-muted)',
          }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 10px)', right: 0,
            width: '240px',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            zIndex: 200,
            animation: 'scaleIn 150ms cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* User info header */}
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
              Nguyễn Văn An
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Thành viên uy tín
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
              <span style={{
                fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                background: 'var(--status-found-bg)', color: 'var(--status-found)',
                border: '1px solid rgba(16,185,129,0.2)',
                padding: '1px 7px', borderRadius: '4px',
              }}>
                Đã xác minh
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hà Nội</span>
            </div>
          </div>

          {/* Menu links */}
          <div style={{ padding: '8px' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 10px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none', fontSize: '0.875rem',
                    transition: 'all 150ms',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-canvas)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <Icon size={15} strokeWidth={1.8} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
            <button
              id="nav-logout-btn"
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 10px', width: '100%',
                borderRadius: 'var(--radius-md)',
                color: '#e03e2d', background: 'none', border: 'none',
                fontSize: '0.875rem', cursor: 'pointer',
                transition: 'all 150ms', fontFamily: 'var(--font-body)',
                textAlign: 'left',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,62,45,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <LogOut size={15} strokeWidth={1.8} />
              Đăng xuất an toàn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── MAIN NAVBAR ── */
export default function Navbar({ isLoggedIn = true }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">
            <ShieldIcon />
          </div>
          <span className="nav-logo-text">TimDo</span>
        </Link>

        {/* Nav Links */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/tim-kiem" className={`nav-link ${isActive('/tim-kiem') ? 'active' : ''}`}>
              Tìm kiếm
            </Link>
          </li>
          <li>
            <Link to="/bai-dang-cua-toi" className={`nav-link ${isActive('/bai-dang-cua-toi') ? 'active' : ''}`}>
              Bài đăng của tôi
            </Link>
          </li>
          <li>
            <Link to="/dang-tin" className={`nav-link ${isActive('/dang-tin') ? 'active' : ''}`}>
              Đăng tin
            </Link>
          </li>
        </ul>

        {/* Actions */}
        <div className="nav-actions">

          {/* Notifications */}
          <button className="nav-icon-btn" id="nav-notifications" aria-label="Thông báo">
            <Bell size={18} />
            <span className="nav-badge">3</span>
          </button>

          {isLoggedIn ? (
            <>
              <Link to="/dang-tin" className="btn btn-accent btn-sm" id="nav-post-btn">
                <Plus size={15} />
                Đăng tin
              </Link>
              <AvatarDropdown />
            </>
          ) : (
            <>
              <Link to="/dang-nhap" className="btn btn-ghost btn-sm" id="nav-login">
                Đăng nhập
              </Link>
              <Link to="/dang-nhap" className="btn btn-accent btn-sm" id="nav-register">
                <Plus size={15} />
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
