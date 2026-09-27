import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, ArrowRight,
  Clock, Users, CheckCircle,
  Package, ChevronRight, Plus,
  UploadCloud, Cpu, ShieldCheck, Handshake
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* === SAMPLE DATA === */
const ITEMS = [
  {
    id: 1,
    status: 'lost',
    category: 'Giấy tờ & Ví',
    title: 'Ví da nam Pedro kèm CCCD',
    desc: 'Rơi tại khu vực gửi xe tòa H1 ĐH Bách Khoa kèm thẻ ngân hàng.',
    location: 'ĐH Bách Khoa, Hà Nội',
    time: '10p trước',
    img: 'https://images.unsplash.com/photo-1627123424574-724758594913?w=400&q=80',
  },
  {
    id: 2,
    status: 'found',
    category: 'Thiết bị điện tử',
    title: 'MacBook Pro M2 Space Gray',
    desc: 'Bàn số 42 tầng 3 thư viện Tạ Quang Bửu, đã gửi lễ tân.',
    location: 'Thư viện Tạ Quang Bửu, HN',
    time: '35p trước',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
  },
  {
    id: 3,
    status: 'found',
    category: 'Chìa khóa',
    title: 'Chìa khóa smartkey Honda',
    desc: 'Nhặt được tại Vinhomes Landmark 81 kèm móc khóa gấu bông.',
    location: 'Vinhomes Central Park, TP.HCM',
    time: '1 giờ trước',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  },
  {
    id: 4,
    status: 'done',
    category: 'Thú cưng',
    title: 'Mèo Anh lông ngắn Golden',
    desc: 'Bé Mochi đã được cư dân toà Sarimi hỗ trợ chăm sóc và trao trả.',
    location: 'KĐT Sala, TP. Thủ Đức',
    time: 'Hôm qua',
    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
  },
  {
    id: 5,
    status: 'lost',
    category: 'Thiết bị điện tử',
    title: 'Điện thoại iPhone 15 Pro xanh',
    desc: 'Để quên trên xe bus tuyến 32, khu vực Nguyễn Trãi. Có ốp lưng trong suốt.',
    location: 'Tuyến 32, Hà Nội',
    time: '2 giờ trước',
    img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80',
  },
  {
    id: 6,
    status: 'found',
    category: 'Ba lô & Túi',
    title: 'Ba lô Xiaomi đen 15L',
    desc: 'Nhặt tại sân D3 ĐHBK, bên trong có sách vở và bút viết.',
    location: 'ĐH Bách Khoa, Hà Nội',
    time: '3 giờ trước',
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
  },
  {
    id: 7,
    status: 'lost',
    category: 'Đồng hồ & Trang sức',
    title: 'Đồng hồ Casio G-Shock đỏ',
    desc: 'Thất lạc tại sân vận động ĐHQG, buổi tối ngày thứ 6.',
    location: 'ĐHQG TP.HCM',
    time: 'Hôm qua',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  },
  {
    id: 8,
    status: 'found',
    category: 'Kính mắt',
    title: 'Kính cận gọng titan mảnh',
    desc: 'Nhặt được tại bàn D12 thư viện, kính độ cao có hộp đựng đen.',
    location: 'Thư viện ĐH Khoa học Tự nhiên',
    time: '5 giờ trước',
    img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80',
  },
];

const STATS = [
  { number: '1,420+', label: 'Món đồ đã trao trả', icon: Package },
  { number: '98.5%', label: 'Tỷ lệ xác minh chuẩn xác', icon: CheckCircle },
  { number: '15 phút', label: 'Thời gian kết nối bình quân', icon: Clock },
  { number: '12,000+', label: 'Thành viên cộng đồng', icon: Users },
];

const FILTER_TABS = [
  { key: 'all', label: 'Tất cả (8)' },
  { key: 'lost', label: 'Cần tìm (3)' },
  { key: 'found', label: 'Nhặt được (3)' },
  { key: 'done', label: 'Đã trả (2)' },
];

const CATEGORIES = [
  'Tất cả danh mục',
  'Thiết bị điện tử',
  'Giấy tờ & Ví',
  'Chìa khóa',
  'Ba lô & Túi',
  'Đồng hồ & Trang sức',
  'Kính mắt',
  'Thú cưng',
];

const QUICK_TAGS = ['Căn cước công dân', 'Ví Pedro ĐHBK', 'AirPods Pro', 'Chìa khóa smartkey'];

const STEPS = [
  {
    num: '01',
    label: 'Bước 01',
    icon: UploadCloud,
    title: 'Đăng thông tin',
    desc: 'Tải ảnh, nhập thời gian và vị trí ước tính một cách nhanh chóng.',
  },
  {
    num: '02',
    label: 'Bước 02',
    icon: Cpu,
    title: 'AI so khớp',
    desc: 'Hệ thống tự động đối chiếu hình ảnh và thông tin trong bán kính 10km.',
  },
  {
    num: '03',
    label: 'Bước 03',
    icon: ShieldCheck,
    title: 'Xác minh bí mật',
    desc: 'Chủ nhân trả lời 3 câu hỏi đặc trưng để xác minh quyền sở hữu an toàn.',
  },
  {
    num: '04',
    label: 'Bước 04',
    icon: Handshake,
    title: 'Trao trả an toàn',
    desc: 'Hẹn gặp tại các điểm tiếp nhận cộng đồng (Safe Zone) hoặc bốt bảo vệ.',
  },
];

const MAP_CLUSTERS = [
  { name: 'Cụm Bách Khoa – Xây Dựng (Hà Nội)', lost: 48, found: 31 },
  { name: 'Làng Đại Học Thủ Đức (TP.HCM)', lost: 64, found: 52 },
  { name: 'ĐHQG Hà Nội – Cầu Giấy', lost: 29, found: 18 },
];

/* ── ITEM CARD COMPONENT ── */
function ItemCard({ item }) {
  const statusBadge = {
    lost: { label: 'Cần tìm', cls: 'badge-lost' },
    found: { label: 'Nhặt được', cls: 'badge-found' },
    done: { label: 'Đã trao trả', cls: 'badge-done' },
  }[item.status];

  return (
    <div className="item-card animate-fadeInUp" id={`item-card-${item.id}`}>
      <div className="item-card-img-wrap">
        <img
          src={item.img}
          alt={item.title}
          className="item-card-img"
          loading="lazy"
          onError={e => { e.target.src = `https://picsum.photos/seed/${item.id}/400/300`; }}
        />
        <div className="item-card-badge">
          <span className={`badge ${statusBadge.cls}`}>{statusBadge.label}</span>
        </div>
        <div className="item-card-time">{item.time}</div>
      </div>
      <div className="item-card-body">
        <div className="item-card-category">{item.category}</div>
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-desc">{item.desc}</p>
        <div className="item-card-meta">
          <MapPin size={11} style={{ flexShrink: 0 }} />
          <span>{item.location}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   HOMEPAGE
══════════════════════════════════════════════ */
export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả danh mục');

  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/tim-kiem');
    }
  };

  const filteredItems = ITEMS.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
    // We remove the local search filter here so the local list below just shows all items (or filtered by status)
    return matchesFilter;
  });

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar isLoggedIn={true} />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          {/* Eyebrow */}
          <div style={{ textAlign: 'center', marginBottom: '0' }}>
            <span className="hero-eyebrow">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              Nền tảng kết nối & tìm kiếm an toàn
            </span>
          </div>

          {/* Title */}
          <h1 className="hero-title animate-fadeInUp" style={{ marginTop: '16px' }}>
            Tìm lại đồ thất lạc<br />
            <span className="hero-title-accent">nhẹ nhàng &amp; an tâm</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle animate-fadeInUp delay-1">
            So khớp quang học AI thông minh và xác minh danh tính bảo mật,
            hỗ trợ kết nối người tìm và người nhặt nhanh chóng.
          </p>

          {/* Search Bar */}
          <div className="animate-fadeInUp delay-2" style={{ maxWidth: '700px', margin: '0 auto 16px' }}>
            <form className="search-bar" onSubmit={handleHeroSearch}>
              <Search size={16} style={{ color: 'var(--text-muted)', marginLeft: '20px', flexShrink: 0 }} />
              <input
                type="text"
                className="search-input"
                placeholder="Nhập tên vật phẩm (vd: CCCD, điện thoại, chìa khóa...)"
                id="hero-search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <div className="search-divider" />
              <select
                className="search-category"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                id="hero-category-select"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <button className="search-btn" id="hero-search-btn" type="submit">
                <Search size={14} />
                Tìm kiếm
              </button>
            </form>

            {/* Quick tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Gợi ý:</span>
              {QUICK_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  style={{
                    fontSize: '0.75rem', color: 'var(--accent)',
                    background: 'rgba(30,107,107,0.08)',
                    border: '1px solid rgba(30,107,107,0.15)',
                    borderRadius: '4px', padding: '2px 8px',
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                    transition: 'all 150ms'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div style={{ marginTop: '48px' }}>
          <div className="stat-row container" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="stat-row-item animate-fadeInUp" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="stat-row-number">{s.number}</div>
                  <div className="stat-row-label">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── RECENT LISTINGS ── */}
      <section className="section" style={{ background: 'var(--bg-canvas)', flex: 1 }}>
        <div className="container">
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>
                Tin đăng gần đây
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Cập nhật theo thời gian thực từ các điểm tiếp nhận và cộng đồng
              </p>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {FILTER_TABS.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  id={`filter-${tab.key}`}
                  className={`chip ${activeFilter === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="items-grid">
            {filteredItems.map((item, i) => (
              <div
                key={item.id}
                style={{ opacity: 0, animation: `fadeInUp 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s forwards` }}
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>

          {/* Load more */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/tim-do-that-lac" className="btn btn-ghost btn-lg" id="view-all-btn">
              Xem tất cả tin đăng
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ MAP SECTION ══ */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: '48px',
            alignItems: 'center',
          }}>
            {/* Left: text + cluster list */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--accent)', background: 'rgba(30,107,107,0.09)',
                border: '1px solid rgba(30,107,107,0.18)',
                padding: '3px 12px', borderRadius: '999px', marginBottom: '18px'
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                Bản đồ tương tác
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
                fontWeight: 800, letterSpacing: '-0.025em',
                lineHeight: 1.25, marginBottom: '14px'
              }}>
                Tra cứu theo bán kính<br />&amp; điểm nóng
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '28px', maxWidth: '36ch' }}>
                Tự động gom cụm các trạm xe buýt, sảnh thư viện, ký túc xá
                giúp người dùng xác định vị trí đồ rơi chuẩn xác.
              </p>

              {/* Cluster list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {MAP_CLUSTERS.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    gap: '12px'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--teal-50)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-canvas)'; }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '3px' }}>{c.name}</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--status-lost)', fontWeight: 600 }}>{c.lost} tin báo mất</span>
                        {' · '}
                        <span style={{ color: 'var(--status-found)', fontWeight: 600 }}>{c.found} tin nhặt được</span>
                      </div>
                    </div>
                    <ChevronRight size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </div>
                ))}
              </div>

              <Link to="/ban-do" className="btn btn-ghost" id="map-view-all-btn"
                style={{ marginTop: '20px', width: 'fit-content' }}>
                <MapPin size={15} />
                Xem toàn bộ bản đồ
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right: Map image */}
            <div style={{ position: 'relative' }}>
              {/* Live badge */}
              <div style={{
                position: 'absolute', top: '16px', left: '16px', zIndex: 2,
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                padding: '5px 12px',
                fontSize: '0.75rem', fontWeight: 600,
                boxShadow: 'var(--shadow-md)',
                backdropFilter: 'blur(8px)',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--status-found)', animation: 'pulse-dot 2s ease-in-out infinite', display: 'inline-block' }} />
                Đang hiển thị 120 điểm tiếp nhận
              </div>

              {/* Embedded OpenStreetMap */}
              <div style={{
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
                height: '380px',
                background: '#e8f4f0',
              }}>
                <iframe
                  title="Bản đồ điểm tiếp nhận TimDo"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=105.7800%2C20.9800%2C105.9200%2C21.0700&layer=mapnik&marker=21.0285%2C105.8542"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4-STEP PROCESS ══ */}
      <section className="section" style={{ background: 'var(--bg-canvas)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--accent)', background: 'rgba(30,107,107,0.09)',
              border: '1px solid rgba(30,107,107,0.18)',
              padding: '3px 12px', borderRadius: '999px', marginBottom: '18px'
            }}>
              Quy trình đơn giản
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '12px'
            }}>
              4 bước xác minh &amp; nhận lại đồ
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', maxWidth: '50ch', margin: '0 auto', lineHeight: 1.7 }}>
              Quy trình khép kín giúp hạn chế tối đa rủi ro nhận hàng giả mạo danh
            </p>
          </div>

          {/* Steps grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
            position: 'relative',
          }}>
            {/* Connector line behind cards */}
            <div style={{
              position: 'absolute',
              top: '36px',
              left: '12.5%',
              right: '12.5%',
              height: '2px',
              background: 'linear-gradient(90deg, var(--teal-300), var(--teal-500))',
              zIndex: 0,
              opacity: 0.35,
            }} />

            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="animate-fadeInUp"
                  style={{
                    animationDelay: `${i * 0.09}s`,
                    padding: '28px 24px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRight: i < 3 ? 'none' : '1px solid var(--border)',
                    position: 'relative', zIndex: 1,
                    borderRadius: i === 0 ? 'var(--radius-xl) 0 0 var(--radius-xl)'
                      : i === 3 ? '0 var(--radius-xl) var(--radius-xl) 0'
                        : '0',
                    transition: 'all 250ms',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--teal-50)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.zIndex = '2';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.border = '1px solid rgba(30,107,107,0.3)';
                    e.currentTarget.style.borderRadius = 'var(--radius-xl)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg-surface)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.zIndex = '1';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.border = '1px solid var(--border)';
                    e.currentTarget.style.borderRight = i < 3 ? 'none' : '1px solid var(--border)';
                    e.currentTarget.style.borderRadius = i === 0 ? 'var(--radius-xl) 0 0 var(--radius-xl)'
                      : i === 3 ? '0 var(--radius-xl) var(--radius-xl) 0' : '0';
                  }}
                >
                  {/* Step icon circle */}
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: '50%',
                    background: 'var(--teal-50)',
                    border: '2px solid rgba(30,107,107,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                    color: 'var(--accent)',
                  }}>
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  {/* Label */}
                  <div style={{
                    fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.1em', color: 'var(--accent)',
                    marginBottom: '6px'
                  }}>
                    {step.label}
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem', fontWeight: 700,
                    marginBottom: '8px', color: 'var(--text-primary)'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ DUAL CTA: LOST & FOUND ══ */}
      <section className="section-sm" style={{ background: 'var(--bg-surface)', paddingBlock: '48px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}>
            {/* Lost CTA */}
            <div style={{
              background: 'var(--teal-900)',
              borderRadius: 'var(--radius-2xl)',
              padding: '40px 44px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '180px', height: '180px',
                background: 'radial-gradient(circle, rgba(94,196,196,0.12) 0%, transparent 70%)',
                borderRadius: '50%',
              }} />
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: '#5ec4c4', background: 'rgba(94,196,196,0.12)',
                border: '1px solid rgba(94,196,196,0.2)',
                padding: '3px 10px', borderRadius: '4px', marginBottom: '20px'
              }}>
                Mất đồ
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem', fontWeight: 800,
                lineHeight: 1.2, marginBottom: '12px', color: 'white'
              }}>
                Bạn đang cần<br />tìm đồ thất lạc?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '28px', maxWidth: '34ch' }}>
                Đăng tin ngay để AI tự động quét và so khớp
                với 1,420+ vật phẩm đã được ghi nhận.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link to="/dang-tin" className="btn btn-lg" id="cta-lost-btn"
                  style={{ background: 'white', color: 'var(--teal-900)', fontWeight: 700 }}>
                  <Plus size={16} />
                  Đăng tin thất lạc
                </Link>
                <Link to="/tim-kiem" className="btn btn-outline-white" id="cta-browse-btn">
                  Tìm kiếm bài đăng hiện có
                </Link>
              </div>
            </div>

            {/* Found CTA */}
            <div style={{
              background: 'var(--bg-canvas)',
              borderRadius: 'var(--radius-2xl)',
              border: '1.5px solid var(--border-strong)',
              padding: '40px 44px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '180px', height: '180px',
                background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
                borderRadius: '50%',
              }} />
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--status-found)', background: 'var(--status-found-bg)',
                border: '1px solid rgba(16,185,129,0.2)',
                padding: '3px 10px', borderRadius: '4px', marginBottom: '20px'
              }}>
                Cộng đồng văn minh
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem', fontWeight: 800,
                lineHeight: 1.2, marginBottom: '12px'
              }}>
                Nhặt được<br />đồ rơi?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '28px', maxWidth: '34ch' }}>
                Mỗi hành động tử tế đều được mã hóa bảo mật
                thông tin cá nhân và trao gửi đúng chủ sở hữu.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/dang-tin?type=found" className="btn btn-accent btn-lg" id="cta-found-btn">
                  <Plus size={16} />
                  Đăng tin nhặt được
                </Link>
                <Link to="/quy-trinh-an-toan" className="btn btn-ghost" id="cta-safe-btn">
                  Sổ tay an toàn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>




      <Footer />
    </div>
  );
}
