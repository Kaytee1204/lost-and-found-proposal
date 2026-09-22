import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Plus, Eye, Trash2, CheckSquare,
  MapPin, Calendar, Clock, Sparkles,
  FileText, CheckCircle, MoreHorizontal, ArrowUpDown, Package, ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ═══════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════ */
const MOCK_POSTS = [
  {
    id: 1, type: 'found', status: 'active',
    title: 'Ví da nam Pedro màu đen',
    location: 'Toà H1, ĐH Bách Khoa',
    date: '18/09/2025', time: '14:30',
    views: 47, aiMatched: true, matchScore: 92,
    img: 'https://images.unsplash.com/photo-1627123424574-724758594913?w=300&q=80',
  },
  {
    id: 2, type: 'lost', status: 'active',
    title: 'iPhone 15 Pro Max Xanh Titan',
    location: 'Tuyến xe 32 – Hà Nội',
    date: '15/09/2025', time: '09:15',
    views: 124, aiMatched: false, matchScore: null,
    img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&q=80',
  },
  {
    id: 3, type: 'found', status: 'resolved',
    title: 'MacBook Pro M2 Space Gray 14 inch',
    location: 'Thư viện Tạ Quang Bửu',
    date: '08/09/2025', time: '16:00',
    views: 88, aiMatched: true, matchScore: 97,
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80',
  },
  {
    id: 4, type: 'lost', status: 'discussing',
    title: 'Chìa khoá xe Honda Wave Alpha',
    location: 'Căng tin C2, ĐH Bách Khoa',
    date: '20/09/2025', time: '11:00',
    views: 12, aiMatched: false, matchScore: null,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
  },
  {
    id: 5, type: 'found', status: 'active',
    title: 'Thẻ sinh viên & Thẻ ATM Vietcombank',
    location: 'Sân bóng khu A, ĐH Bách Khoa',
    date: '21/09/2025', time: '18:45',
    views: 5, aiMatched: false, matchScore: null,
    img: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=300&q=80',
  },
];

const STATUS_CONFIG = {
  active:     { label: 'Đang hiển thị', dot: 'var(--status-found)' },
  resolved:   { label: 'Đã giải quyết', dot: 'var(--status-done)' },
  discussing: { label: 'Đang trao đổi', dot: 'var(--status-warning)' },
};

const TYPE_CONFIG = {
  found: { label: 'Nhặt được', cls: 'badge-found' },
  lost:  { label: 'Cần tìm',   cls: 'badge-lost' },
};

const FILTERS = [
  { key: 'all',        label: 'Tất cả' },
  { key: 'active',     label: 'Đang hiển thị' },
  { key: 'discussing', label: 'Đang trao đổi' },
  { key: 'resolved',   label: 'Đã giải quyết' },
  { key: 'lost',       label: 'Cần tìm' },
  { key: 'found',      label: 'Nhặt được' },
];

/* ═══════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════ */
function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '80px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(30,107,107,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--teal-300)',
      }}>
        <Package size={36} strokeWidth={1.4} />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
          Không tìm thấy bài đăng nào
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '32ch', margin: '0 auto' }}>
          Thử đổi bộ lọc hoặc đăng tin mới để bắt đầu.
        </div>
      </div>
      <Link to="/dang-tin" className="btn btn-accent" style={{ marginTop: '8px' }}>
        <Plus size={16} /> Đăng tin mới
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════
   POST ROW — click vào hàng để xem chi tiết
═══════════════════════════════════════ */
function PostRow({ post, onResolve, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const s = STATUS_CONFIG[post.status] || STATUS_CONFIG.active;
  const t = TYPE_CONFIG[post.type];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 1fr 140px 110px 70px 36px',
        gap: '16px', alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        transition: 'background 150ms',
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/chi-tiet/${post.id}`)}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Thumbnail */}
      <img
        src={post.img}
        alt={post.title}
        style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border)' }}
        onError={e => { e.target.src = `https://picsum.photos/seed/${post.id}/56/56`; }}
      />

      {/* Title & badges */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span className={`badge ${t.cls}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{t.label}</span>
          {post.aiMatched ? (
            <span style={{
              fontSize: '0.65rem', fontWeight: 600, color: 'var(--status-found)',
              background: 'var(--status-found-bg)', border: '1px solid rgba(16,185,129,0.2)',
              padding: '2px 8px', borderRadius: '4px',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <Sparkles size={10} /> AI khớp {post.matchScore}%
            </span>
          ) : (
            <span style={{
              fontSize: '0.65rem', fontWeight: 500, color: 'var(--text-muted)',
              background: 'var(--bg-canvas)', border: '1px solid var(--border)',
              padding: '2px 8px', borderRadius: '4px',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <Sparkles size={10} /> Chưa quét AI
            </span>
          )}
        </div>
        <div style={{
          fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)',
          marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {post.title}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={11} /> {post.location}
        </div>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</span>
      </div>

      {/* Date */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={11} /> {post.date}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={11} /> {post.time}
        </span>
      </div>

      {/* Views */}
      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Eye size={13} /> {post.views}
      </div>

      {/* Actions menu — stopPropagation để không trigger navigate */}
      <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            width: 32, height: 32, borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', transition: 'all 150ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <MoreHorizontal size={15} />
        </button>
        {menuOpen && (
          <div style={{
            position: 'absolute', right: 0, top: '38px', zIndex: 50,
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden', minWidth: '180px',
          }}>
            {[
              { icon: ArrowRight, label: 'Xem chi tiết', color: 'var(--text-primary)', action: () => { navigate(`/chi-tiet/${post.id}`); setMenuOpen(false); } },
              { icon: CheckSquare, label: 'Đánh dấu đã xong', color: 'var(--status-found)', action: () => { onResolve(post.id); setMenuOpen(false); } },
              { icon: Trash2, label: 'Xoá bài đăng', color: 'var(--status-lost)', action: () => { onDelete(post.id); setMenuOpen(false); } },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={item.action}
                  style={{
                    width: '100%', padding: '10px 16px',
                    background: 'transparent', border: 'none',
                    borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '0.875rem', fontWeight: 500, color: item.color,
                    cursor: 'pointer', transition: 'background 150ms', fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-canvas)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Icon size={14} />{item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   TABLE HEADER
═══════════════════════════════════════ */
function TableHeader() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '56px 1fr 140px 110px 70px 36px',
      gap: '16px', alignItems: 'center',
      padding: '12px 24px', borderBottom: '2px solid var(--border)',
      background: 'var(--bg-canvas)',
    }}>
      <div style={{ gridColumn: '1 / 3' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          Vật phẩm
        </span>
      </div>
      {['Trạng thái', 'Ngày đăng', 'Lượt xem', ''].map((col, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            {col}
          </span>
          {col && <ArrowUpDown size={10} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function MyPostsPage() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');

  const handleResolve = (id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'resolved' } : p));
  const handleDelete = (id) => setPosts(prev => prev.filter(p => p.id !== id));

  const filtered = posts.filter(p => {
    const matchFilter = activeFilter === 'all' || p.status === activeFilter || p.type === activeFilter;
    const matchSearch = !searchQ || p.title.toLowerCase().includes(searchQ.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, background: 'var(--bg-canvas)', padding: '48px 0 100px' }}>
        <div className="container">

          {/* ── Header ── */}
          <div style={{
            display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '6px' }}>
                Quản lý cá nhân
              </div>
              <h1 className="text-display-md">Bài đăng của tôi</h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Theo dõi và quản lý tất cả bài đăng. Vào chi tiết từng bài để kích hoạt AI Smart Match.
              </p>
            </div>
            <Link to="/dang-tin" className="btn btn-primary">
              <Plus size={16} /> Đăng tin mới
            </Link>
          </div>

          {/* ── Stats Bar (3 ô) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Tổng bài đăng',  value: posts.length,                                       icon: FileText,    color: 'var(--accent)' },
              { label: 'Đang hiển thị',  value: posts.filter(p => p.status === 'active').length,    icon: Eye,         color: 'var(--status-found)' },
              { label: 'Đã giải quyết',  value: posts.filter(p => p.status === 'resolved').length,  icon: CheckCircle, color: '#6366f1' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)', padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-md)',
                    background: 'rgba(30,107,107,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: s.color, flexShrink: 0,
                  }}>
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Filters & Search ── */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <button
                  key={f.key} type="button"
                  className={`chip ${activeFilter === f.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f.key)}
                  style={{ padding: '7px 14px', fontSize: '0.8125rem' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="input-icon-wrap" style={{ width: '260px' }}>
              <span className="input-icon"><Search size={15} /></span>
              <input
                type="text" className="input"
                placeholder="Tìm theo tên vật phẩm..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                style={{ fontSize: '0.875rem', padding: '9px 12px 9px 36px' }}
              />
            </div>
          </div>

          {/* ── Table ── */}
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
          }}>
            <TableHeader />
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              filtered.map(post => (
                <PostRow
                  key={post.id}
                  post={post}
                  onResolve={handleResolve}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
