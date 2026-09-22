import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Shield, CheckCircle,
  Edit3, Bell, Lock, LogOut, Package, Clock,
  Star, ChevronRight, ArrowRight, Camera, FileText,
  Calendar, Award, AlertTriangle, UploadCloud, Settings,
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ════════════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════════════ */
const USER = {
  name: 'Nguyễn Văn An',

  email: 'an.nguyen@gmail.com',
  phone: '0912 345 678',
  job: 'Kỹ sư Phần mềm',
  address: 'Hai Bà Trưng, Hà Nội',
  joinDate: 'Tháng 9, 2023',
  verified: true,
  twoFA: true,
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=NVA&backgroundColor=1e6b6b&textColor=ffffff',
  stats: [
    { label: 'Tin đã đăng', value: '12', sub: 'tổng cộng', icon: FileText },
    { label: 'Đã trao trả', value: '7', sub: 'thành công', icon: CheckCircle },
    { label: 'Đang xử lý', value: '3', sub: 'chờ xác minh', icon: Clock },
    { label: 'Điểm uy tín', value: '4.9', sub: '/ 5.0', icon: Star },
  ],
};

const MY_POSTS = [
  {
    id: 1, status: 'found', title: 'Ví da nam Pedro',
    category: 'Giấy tờ & Ví', date: '18/09/2025', location: 'Toà H1, ĐHBK',
    img: 'https://images.unsplash.com/photo-1627123424574-724758594913?w=300&q=80',
    matched: true,
  },
  {
    id: 2, status: 'lost', title: 'Điện thoại iPhone 15 Pro xanh',
    category: 'Thiết bị điện tử', date: '15/09/2025', location: 'Tuyến 32, Hà Nội',
    img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&q=80',
    matched: false,
  },
  {
    id: 3, status: 'done', title: 'MacBook Pro M2 Space Gray',
    category: 'Thiết bị điện tử', date: '08/09/2025', location: 'Thư viện TQB',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80',
    matched: true,
  },
];

const ACTIVITY_LOG = [
  { icon: CheckCircle, color: 'var(--status-found)', label: 'Xác minh quyền sở hữu thành công', detail: 'Ví Pedro — Chủ nhân đã nhận đồ', time: '2 ngày trước' },
  { icon: Bell, color: 'var(--accent)', label: 'AI so khớp mới', detail: 'iPhone 15 Pro có 3 kết quả khớp mới', time: '4 ngày trước' },
  { icon: UploadCloud, color: '#6366f1', label: 'Đăng tin thất lạc', detail: 'Điện thoại iPhone 15 Pro xanh', time: '6 ngày trước' },
  { icon: Shield, color: 'var(--accent)', label: 'Xác thực 2FA kích hoạt', detail: 'Tài khoản được bảo mật 2 lớp', time: '10 ngày trước' },
];

const STATUS_MAP = {
  found: { label: 'Nhặt được', cls: 'badge-found' },
  lost: { label: 'Cần tìm', cls: 'badge-lost' },
  done: { label: 'Đã trả', cls: 'badge-done' },
};

/* ════════════════════════════════════════════════
   SUB-COMPONENTS
════════════════════════════════════════════════ */
function StatCard({ stat, index }) {
  const Icon = stat.icon;
  return (
    <div
      className="animate-fadeInUp"
      style={{
        animationDelay: `${index * 0.07}s`,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 24px',
        transition: 'all 250ms cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'rgba(30,107,107,0.25)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 'var(--radius-md)',
        background: 'rgba(30,107,107,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent)', marginBottom: '16px',
      }}>
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '1.875rem',
        fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)',
        lineHeight: 1,
      }}>
        {stat.value}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.sub}</div>
      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '6px' }}>
        {stat.label}
      </div>
    </div>
  );
}

function PostRow({ post }) {
  const s = STATUS_MAP[post.status];
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: '52px 1fr auto',
        gap: '14px', alignItems: 'center',
        padding: '14px 0',
        borderBottom: '1px solid var(--border)',
        transition: 'background 150ms',
        cursor: 'pointer',
      }}
    >
      <img
        src={post.img}
        alt={post.title}
        style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
        onError={e => { e.target.src = `https://picsum.photos/seed/${post.id}/52/52`; }}
      />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
          <span className={`badge ${s.cls}`} style={{ fontSize: '0.65rem', padding: '1px 7px' }}>{s.label}</span>
          {post.matched && (
            <span style={{
              fontSize: '0.65rem', fontWeight: 600, color: 'var(--status-found)',
              background: 'var(--status-found-bg)', border: '1px solid rgba(16,185,129,0.2)',
              padding: '1px 7px', borderRadius: '4px',
            }}>
              AI khớp
            </span>
          )}
        </div>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
          {post.title}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={11} /> {post.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={11} /> {post.date}
          </span>
        </div>
      </div>
      <ChevronRight size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </div>
  );
}

/* ════════════════════════════════════════════════
   PROFILE TABS
════════════════════════════════════════════════ */
const TABS = [
  { key: 'posts', label: 'Tin đăng của tôi' },
  { key: 'activity', label: 'Lịch sử hoạt động' },
  { key: 'security', label: 'Bảo mật & Quyền riêng tư' },
];

function PostsTab() {
  const [filter, setFilter] = useState('all');
  const filters = [
    { key: 'all', label: 'Tất cả (12)' },
    { key: 'lost', label: 'Cần tìm (3)' },
    { key: 'found', label: 'Nhặt được (6)' },
    { key: 'done', label: 'Đã trao trả (3)' },
  ];
  const shown = filter === 'all' ? MY_POSTS : MY_POSTS.filter(p => p.status === filter);
  return (
    <div>
      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {filters.map(f => (
          <button
            key={f.key}
            type="button"
            className={`chip ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {/* Post list */}
      <div>
        {shown.map(post => <PostRow key={post.id} post={post} />)}
      </div>
      <Link to="/bai-dang-cua-toi" className="btn btn-ghost"
        style={{ marginTop: '20px', width: 'fit-content' }}>
        Xem tất cả bài đăng
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function ActivityTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {ACTIVITY_LOG.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            style={{
              display: 'grid', gridTemplateColumns: '36px 1fr auto',
              gap: '14px', alignItems: 'flex-start',
              padding: '16px 0',
              borderBottom: i < ACTIVITY_LOG.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(30,107,107,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: item.color, flexShrink: 0,
            }}>
              <Icon size={16} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.detail}</div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, paddingTop: '2px' }}>
              {item.time}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SecurityTab() {
  const [twoFA, setTwoFA] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 2FA block */}
      <div style={{
        background: twoFA ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)',
        border: `1px solid ${twoFA ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
        borderRadius: 'var(--radius-xl)', padding: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-md)',
              background: twoFA ? 'var(--status-found-bg)' : 'rgba(239,68,68,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: twoFA ? 'var(--status-found)' : '#ef4444',
            }}>
              <Shield size={18} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                Xác thực 2 lớp (2FA)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {twoFA ? 'Đang bảo vệ tài khoản của bạn' : 'Bật để bảo vệ tài khoản'}
              </div>
            </div>
          </div>
          {/* Toggle */}
          <button
            id="toggle-2fa-btn"
            onClick={() => setTwoFA(!twoFA)}
            style={{
              width: 46, height: 26, borderRadius: '999px',
              background: twoFA ? 'var(--status-found)' : 'var(--border-strong)',
              border: 'none', cursor: 'pointer', position: 'relative',
              transition: 'background 200ms',
              flexShrink: 0,
            }}
            aria-label="Toggle 2FA"
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: 'white',
              position: 'absolute', top: '3px',
              left: twoFA ? '23px' : '3px',
              transition: 'left 200ms cubic-bezier(0.34,1.56,0.64,1)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>
      </div>

      {/* Notification settings */}
      <div style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg-canvas)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Thông báo</div>
        </div>
        {[
          { id: 'email-notif', label: 'Thông báo qua Email', desc: 'Khi có kết quả AI so khớp mới', val: emailNotif, set: setEmailNotif },
          { id: 'push-notif', label: 'Thông báo đẩy trình duyệt', desc: 'Cập nhật thời gian thực trên thiết bị', val: pushNotif, set: setPushNotif },
        ].map((item, i, arr) => (
          <div
            key={item.id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
              padding: '16px 18px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{item.label}</div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
            <button
              id={item.id}
              onClick={() => item.set(!item.val)}
              style={{
                width: 46, height: 26, borderRadius: '999px',
                background: item.val ? 'var(--accent)' : 'var(--border-strong)',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 200ms', flexShrink: 0,
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%', background: 'white',
                position: 'absolute', top: '3px',
                left: item.val ? '23px' : '3px',
                transition: 'left 200ms cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div style={{
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(239,68,68,0.1)', background: 'rgba(239,68,68,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={15} style={{ color: '#ef4444' }} strokeWidth={1.8} />
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ef4444' }}>Vùng nguy hiểm</div>
          </div>
        </div>
        <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
              Xóa tài khoản vĩnh viễn
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Toàn bộ dữ liệu sẽ bị xóa và không thể khôi phục
            </div>
          </div>
          <button
            id="delete-account-btn"
            style={{
              padding: '7px 16px', borderRadius: 'var(--radius-md)',
              background: 'none', border: '1.5px solid rgba(239,68,68,0.4)',
              color: '#ef4444', fontSize: '0.8125rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-body)',
              transition: 'all 150ms', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            Xóa tài khoản
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PROFILE PAGE
════════════════════════════════════════════════ */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({
    name: USER.name,
    email: USER.email,
    phone: USER.phone,
    job: USER.job,
  });

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar isLoggedIn={true} />

      {/* ── PAGE HERO / HEADER ── */}
      <section style={{
        background: 'linear-gradient(160deg, var(--teal-900) 0%, #0f3d3d 100%)',
        padding: '56px 0 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle background pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 80% 40%, rgba(94,196,196,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '28px', flexWrap: 'wrap' }}>
            {/* Avatar block */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {/* Outer shell (Double-Bezel technique) */}
              <div style={{
                padding: '4px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <img
                  src={USER.avatar}
                  alt={USER.name}
                  style={{ width: 96, height: 96, borderRadius: '50%', display: 'block' }}
                />
              </div>
              {/* Camera edit overlay */}
              <button
                id="avatar-upload-btn"
                style={{
                  position: 'absolute', bottom: 4, right: 4,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'white', border: '2px solid var(--teal-900)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--accent)',
                  transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                aria-label="Thay ảnh đại diện"
              >
                <Camera size={13} />
              </button>
            </div>

            {/* User info */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 800, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.1,
                }}>
                  {USER.name}
                </h1>
                {USER.verified && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                    background: 'rgba(16,185,129,0.18)', color: '#6ee7b7',
                    border: '1px solid rgba(110,231,183,0.25)',
                    padding: '2px 9px', borderRadius: '4px',
                  }}>
                    <CheckCircle size={10} />
                    Đã xác minh
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.8125rem',
                  color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em',
                }}>
                  SĐT: {USER.phone}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)' }}>
                  {USER.job}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>
                  <MapPin size={12} />
                  {USER.address}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>
                  <Calendar size={12} />
                  Tham gia {USER.joinDate}
                </div>
                {USER.twoFA && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8125rem', color: 'rgba(94,196,196,0.9)', fontWeight: 600 }}>
                    <Shield size={12} />
                    2FA Bật
                  </div>
                )}
              </div>
            </div>

            {/* Edit button */}
            <button
              id="profile-edit-btn"
              onClick={() => setEditMode(!editMode)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px',
                background: editMode ? 'white' : 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 'var(--radius-lg)',
                color: editMode ? 'var(--teal-900)' : 'white',
                fontSize: '0.875rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all 200ms cubic-bezier(0.34,1.56,0.64,1)',
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (!editMode) e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { if (!editMode) e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            >
              <Edit3 size={15} strokeWidth={1.8} />
              {editMode ? 'Huỷ chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
            </button>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div style={{ background: 'var(--bg-canvas)', flex: 1 }}>
        <div className="container" style={{ paddingTop: 0 }}>
          {/* Pull-up card layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '24px',
            marginTop: '-40px',
            alignItems: 'flex-start',
          }}>

            {/* ── LEFT: Main card ── */}
            <div>
              {/* Stats grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
                marginBottom: '24px',
              }}>
                {USER.stats.map((s, i) => <StatCard key={i} stat={s} index={i} />)}
              </div>

              {/* Tabs + content card */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}>
                {/* Tab bar */}
                <div style={{
                  display: 'flex',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--bg-canvas)',
                  padding: '0 24px',
                  gap: '4px',
                }}>
                  {TABS.map(tab => (
                    <button
                      key={tab.key}
                      id={`tab-profile-${tab.key}`}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        padding: '14px 16px',
                        background: 'none', border: 'none',
                        borderBottom: `2px solid ${activeTab === tab.key ? 'var(--accent)' : 'transparent'}`,
                        color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-secondary)',
                        fontSize: '0.875rem', fontWeight: activeTab === tab.key ? 700 : 500,
                        cursor: 'pointer', fontFamily: 'var(--font-body)',
                        transition: 'all 150ms', whiteSpace: 'nowrap',
                        marginBottom: '-1px',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div style={{ padding: '24px' }}>
                  {activeTab === 'posts' && <PostsTab />}
                  {activeTab === 'activity' && <ActivityTab />}
                  {activeTab === 'security' && <SecurityTab />}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Personal info / edit card */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{
                  padding: '16px 20px', borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                    Thông tin cá nhân
                  </div>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600,
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      <Edit3 size={13} />
                      Sửa
                    </button>
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                  {editMode ? (
                    /* Edit form */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[
                        { id: 'edit-name', label: 'Họ và tên', key: 'name', icon: User, type: 'text' },
                        { id: 'edit-email', label: 'Email liên hệ', key: 'email', icon: Mail, type: 'email' },
                        { id: 'edit-phone', label: 'Số điện thoại', key: 'phone', icon: Phone, type: 'tel' },
                        { id: 'edit-job', label: 'Nghề nghiệp', key: 'job', icon: Award, type: 'text' },
                      ].map(field => {
                        const Icon = field.icon;
                        return (
                          <div key={field.key} className="input-group">
                            <label className="input-label" htmlFor={field.id}>{field.label}</label>
                            <div className="input-icon-wrap">
                              <span className="input-icon"><Icon size={14} /></span>
                              <input
                                id={field.id}
                                type={field.type}
                                className="input"
                                value={formValues[field.key]}
                                onChange={e => setFormValues({ ...formValues, [field.key]: e.target.value })}
                              />
                            </div>
                          </div>
                        );
                      })}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button
                          id="save-profile-btn"
                          type="button"
                          className="btn btn-accent btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => setEditMode(false)}
                        >
                          Lưu thay đổi
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setEditMode(false)}
                        >
                          Huỷ
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[
                        { icon: User, label: 'Họ và tên', value: USER.name },
                        { icon: Mail, label: 'Email liên hệ', value: USER.email },
                        { icon: Phone, label: 'Điện thoại', value: USER.phone },
                        { icon: Award, label: 'Nghề nghiệp', value: USER.job },
                        { icon: MapPin, label: 'Địa chỉ', value: USER.address },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: 'var(--radius-md)',
                              background: 'rgba(30,107,107,0.07)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'var(--accent)', flexShrink: 0, marginTop: '1px',
                            }}>
                              <Icon size={14} strokeWidth={1.8} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1px', fontWeight: 500 }}>
                                {item.label}
                              </div>
                              <div style={{ fontSize: '0.8375rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>
                                {item.value}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick actions */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                    Thao tác nhanh
                  </div>
                </div>
                <div style={{ padding: '8px' }}>
                  {[
                    { icon: Package, label: 'Đăng tin mới', to: '/dang-tin', accent: true },
                    { icon: Lock, label: 'Đổi mật khẩu', to: '/cai-dat/mat-khau' },
                    { icon: Bell, label: 'Cài đặt thông báo', to: '/cai-dat/thong-bao' },
                    { icon: Settings, label: 'Cài đặt tài khoản', to: '/cai-dat' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={i}
                        to={item.to}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-md)',
                          color: item.accent ? 'var(--accent)' : 'var(--text-secondary)',
                          textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                          transition: 'all 150ms',
                          justifyContent: 'space-between',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-canvas)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = item.accent ? 'var(--accent)' : 'var(--text-secondary)'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Icon size={15} strokeWidth={1.8} />
                          {item.label}
                        </div>
                        <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
                      </Link>
                    );
                  })}

                  {/* Logout */}
                  <Link
                    to="/dang-nhap"
                    id="sidebar-logout-btn"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      color: '#e03e2d', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                      transition: 'all 150ms', marginTop: '4px',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '14px', marginTop: '8px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,62,45,0.07)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <LogOut size={15} strokeWidth={1.8} />
                      Đăng xuất
                    </div>
                    <ChevronRight size={13} style={{ color: 'rgba(224,62,45,0.5)' }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '64px' }}>
        <Footer />
      </div>
    </div>
  );
}
